from fastapi import FastAPI, Depends, HTTPException
import os
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel
import json
import urllib.request
import re

# Mocking database to stop 'Could not find name get_db' errors if file is missing
def get_db():
    try:
        yield None
    finally:
        pass

app = FastAPI(
    title="SmartFlow AI Service",
    description="Microservice for financial predictions and risk analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class RiskAnalysisResponse(BaseModel):
    invoice_id: str
    risk_score: float
    priority: str
    recommendation: str

class PaymentPredictionResponse(BaseModel):
    invoice_id: str
    predicted_date: str
    confidence: float

class Insight(BaseModel):
    type: str
    priority: str
    title: str
    description: str
    targetId: Optional[str] = None

class PeerComparisonResponse(BaseModel):
    recommendation: str

class CashflowForecast(BaseModel):
    date: str
    inflow: float
    outflow: float
    balance: float

class ExpenseCategorization(BaseModel):
    description: str
    suggested_category: str
    confidence: float

# --- OpenAI Integration ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def call_openai(prompt: str, system_prompt: str = "You are a financial AI assistant. Be concise and precise.") -> str:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    data = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return ""

# --- AI Logic ---

def calculate_risk(amount: float, days_overdue: int, client_risk_index: int) -> float:
    risk = (client_risk_index / 100.0) * 0.5
    if amount > 10000:
        risk += 0.2
    if days_overdue > 0:
        risk += 0.3
    return min(risk, 1.0)

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "SmartFlow AI Service is running", "docs": "/docs"}

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    return {"status": "UP", "service": "smartflow-erp-ai"}


@app.get("/api/v1/ai/insights", response_model=List[Insight])
async def get_insights(role: str = "MANAGER"):
    """
    Role-Aware Insight Generation.
    Provides tailored intelligence based on the user's role.
    """
    insights = {
        "MANAGER": [
            {"type": "CASHFLOW", "priority": "HIGH", "title": "Revenue Forecast", "description": "Expect 15% increase in collections next month based on historical trends."},
            {"type": "RISK", "priority": "MEDIUM", "title": "Portfolio Exposure", "description": "3 clients reached HIGH risk tier today."}
        ],
        "ACCOUNTANT": [
            {"type": "RECONCILIATION", "priority": "HIGH", "title": "Payment Anomaly", "description": "INV-009 payment amount doesn't match ledger."},
            {"type": "DISCOUNT", "priority": "LOW", "title": "Early Settlement Opportunity", "description": "5 clients eligible for early-pay discounts."}
        ],
        "RECOVERY_AGENT": [
            {"type": "DEBT_RECOVERY", "priority": "HIGH", "title": "Priority Recovery", "description": "INV-004 is overdue by 30 days. Risk score: 0.85."},
            {"type": "STRATEGY", "priority": "MEDIUM", "title": "Tone Suggestion", "description": "For client 'StartUp Labs', use a FIRM but COLLABORATIVE tone."}
        ],
        "CLIENT": [
            {"type": "SAVINGS", "priority": "MEDIUM", "title": "Save on Fees", "description": "Pay early to unlock a 2% settlement discount."},
            {"type": "CREDIT_SCORE", "priority": "LOW", "title": "Credit Improvement", "description": "Your payment reliability increased by 5%."}
        ],
        "ADMIN": [
            {"type": "SYSTEM", "priority": "LOW", "title": "API Performance", "description": "All microservices are communicating within normal latency bounds."}
        ]
    }
    return insights.get(role.upper(), insights["MANAGER"])

@app.get("/api/v1/ai/peer-comparison", response_model=PeerComparisonResponse)
async def get_peer_comparison(client_id: str):
    return {
        "client_id": client_id,
        "peer_average_payment_days": 14.5,
        "client_payment_days": 12.0,
        "percentile": 85.0,
        "recommendation": "You are paying faster than 85% of your industry peers."
    }

@app.post("/api/v1/ai/predict-payment", response_model=PaymentPredictionResponse)
async def predict_payment(invoice_id: str, due_date: str, client_avg_delay: int):
    due = datetime.strptime(due_date, "%Y-%m-%d")
    predicted = due + timedelta(days=client_avg_delay)
    return {
        "invoice_id": invoice_id,
        "predicted_date": predicted.strftime("%Y-%m-%d"),
        "confidence": 0.92
    }

@app.get("/api/v1/ai/risk/{invoice_id}", response_model=RiskAnalysisResponse)
async def analyze_invoice_risk(invoice_id: str, amount: float, days_overdue: int, client_risk_index: int):
    # Use OpenAI to generate recommendation based on parameters
    prompt = f"Invoice {invoice_id} is overdue by {days_overdue} days. Amount is {amount}. Client historical risk index is {client_risk_index} out of 100. Provide a 1 sentence recommendation on how to handle this debt collection."
    recommendation = call_openai(prompt)
    if not recommendation:
        recommendation = "Firm reminder and credit hold"
        
    score = calculate_risk(amount, days_overdue, client_risk_index)
    return {
        "invoice_id": invoice_id,
        "risk_score": score,
        "priority": "HIGH" if score > 0.7 else "MEDIUM" if score > 0.4 else "LOW",
        "recommendation": recommendation.strip()
    }

@app.get("/api/v1/ai/forecast/cashflow", response_model=List[CashflowForecast])
async def get_cashflow_forecast(days: int = 30):
    """
    Predictive cashflow forecasting based on historical invoices and payments.
    """
    today = datetime.now()
    forecast = []
    current_balance = 50000.0
    for i in range(days):
        date = today + timedelta(days=i)
        inflow = 2000.0 + (i * 100) # Simplified mock growth
        outflow = 1500.0
        current_balance += (inflow - outflow)
        forecast.append({
            "date": date.strftime("%Y-%m-%d"),
            "inflow": inflow,
            "outflow": outflow,
            "balance": current_balance
        })
    return forecast

@app.post("/api/v1/ai/categorize-expense", response_model=ExpenseCategorization)
async def categorize_expense(description: str):
    """
    AI-powered categorization of expense descriptions.
    """
    prompt = f"Categorize the following business expense: '{description}'. Reply ONLY with the category name (e.g., IT Infrastructure, Operations, Business Travel, Human Resources, Fixed Costs, General Expenses, Software, Marketing, etc)."
    suggested = call_openai(prompt, "You are a precise accountant categorizing expenses.")
    
    category = suggested.strip() if suggested else "General Expenses"
    
    return {
        "description": description,
        "suggested_category": category,
        "confidence": 0.95 if suggested else 0.5
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
