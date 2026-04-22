(ns smartflow.rules.core
  (:require [compojure.core :refer [defroutes POST GET ANY]]
            [compojure.route :as route]
            [ring.adapter.jetty :refer [run-jetty]]
            [cheshire.core :as json]
            [clj-http.client :as http])
  (:import [java.time LocalDate]
           [java.time.temporal ChronoUnit])
  (:gen-class))

;; --- Constants ---
(def python-api-url (or (System/getenv "AI_SERVICE_URL") "http://localhost:8000/api/v1/ai"))

;; --- Business Logic (The functional part) ---

(defn fetch-risk-score [invoice-id]
  (try
    (let [response (http/get (str python-api-url "/risk/" invoice-id) {:as :json})]
      (get-in response [:body :risk_score]))
    (catch Exception e
      (println "Warning: Could not fetch risk score" (.getMessage e))
      0.5))) ;; Default to neutral risk if service is down

(defn calculate-allocation [payment-amount invoices risk-score]
  (let [;; If risk-score is high (> 0.7), prioritize high-value invoices first (Recovery mode)
        ;; Otherwise, split proportionally or pay oldest first (Standard mode)
        strategy (if (> risk-score 0.7) :priority :proportional)
        sorted-invoices (if (= strategy :priority)
                          (sort-by :amount > invoices)
                          (sort-by :dueDate invoices))]
    {:strategy strategy
     :risk_score risk-score
     :allocations (loop [remaining payment-amount
                         [invoice & rest-invoices] sorted-invoices
                         acc []]
                    (if (or (<= remaining 0) (nil? invoice))
                      acc
                      (let [amount-to-pay (min remaining (:amount invoice))]
                        (recur (- remaining amount-to-pay)
                               rest-invoices
                               (conj acc {:invoice_id (:id invoice)
                                          :amount_paid amount-to-pay})))))}))

;; --- Role-Specific Rules ---

(defn early-settlement-discount
  "Accountant Rule: If paying before 10 days of due date, apply 2% discount"
  [invoice]
  (let [due-date (LocalDate/parse (:dueDate invoice))
        today (LocalDate/now)
        days-until-due (.between (ChronoUnit/DAYS) today due-date)]
    (if (>= days-until-due 10)
      (* (:amount invoice) 0.02)
      0)))

(defn prioritize-recovery-cases
  "Recovery Agent Rule: Rank cases by (amount * risk_score / days_overdue)"
  [cases]
  (sort-by (fn [c] (/ (* (:amount c) (:risk_score c)) 
                      (max 1 (:days_overdue c)))) > cases))

(defn marketplace-recommendations
  "Client Rule: Recommend integrations based on industry/size"
  [client-profile]
  (case (:industry client-profile)
    "RETAIL" [{:name "Shopify Sync" :id "mkt-001"} {:name "Point of Sale Plus" :id "mkt-002"}]
    "SERVICES" [{:name "Booking Pro" :id "mkt-003"} {:name "Project Tracker" :id "mkt-004"}]
    [{:name "General Ledger Plus" :id "mkt-005"}]))

;; --- API Handlers ---

(defn handle-allocation [request]
  (let [body (json/parse-string (slurp (:body request)) true)
        amount (:payment_amount body)
        invoices (:invoices body)
        first-id (:id (first invoices))
        risk (fetch-risk-score first-id)
        result (calculate-allocation amount invoices risk)]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string result)}))

(defn handle-marketplace [request]
  (let [profile (json/parse-string (slurp (:body request)) true)
        recs (marketplace-recommendations profile)]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string recs)}))

(defn match-reconciliation
  "Rule: Match a bank statement entry to an invoice based on amount (strict) and reference (fuzzy)"
  [entry invoices]
  (let [amount (:amount entry)
        ref (:reference entry)]
    (filter (fn [inv] 
              (and (== (:amount inv) amount)
                   (or (.contains (.toLowerCase (:reference inv)) (.toLowerCase ref))
                       (.contains (.toLowerCase ref) (.toLowerCase (:reference inv))))))
            invoices)))

(defn calculate-late-fees
  "Rule: 5% late fee if > 30 days overdue, 10% if > 60 days"
  [invoice]
  (let [days (:days_overdue invoice)]
    (cond
      (> days 60) (* (:amount invoice) 0.10)
      (> days 30) (* (:amount invoice) 0.05)
      :else 0)))

(defn handle-reconcile [request]
  (let [body (json/parse-string (slurp (:body request)) true)
        matches (match-reconciliation (:entry body) (:invoices body))]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string matches)}))

(defn handle-late-fees [request]
  (let [invoice (json/parse-string (slurp (:body request)) true)
        fee (calculate-late-fees invoice)]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string {:late_fee fee})}))

(defroutes app-routes
  (GET "/" [] (json/generate-string {:status "SmartFlow Rules Engine is running"}))
  (ANY "/health" [] {:status 200 :headers {"Content-Type" "application/json"} :body (json/generate-string {:status "UP" :service "smartflow-erp-rules"})})
  (POST "/api/v1/rules/allocate" [] handle-allocation)
  (POST "/api/v1/rules/marketplace" [] handle-marketplace)
  (POST "/api/v1/rules/reconcile" [] handle-reconcile)
  (POST "/api/v1/rules/late-fees" [] handle-late-fees)
  (route/not-found "Not Found"))

;; --- Entry Point ---

(defn -main [& args]
  (let [port (Integer/parseInt (or (System/getenv "PORT") "8001"))]
    (println "Starting SmartFlow Rules Engine on port" port "...")
    (run-jetty app-routes {:port port :host "0.0.0.0" :join? false})))
