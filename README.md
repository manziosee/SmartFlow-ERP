# SmartFlow ERP 🚀

**SmartFlow ERP** is a modern, polyglot, AI-powered financial and operations platform specifically designed for Small and Medium Enterprises (SMEs). It harmonizes cutting-edge web technologies with a distributed microservices architecture to deliver real-time intelligence, automated workflows, and robust financial governance.

---

## 🛠️ Polyglot Tech Stack

The system leverages the unique strengths of multiple programming languages to create a highly resilient and specialized ecosystem:

### 🧩 Core Ecosystem
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Java 21](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Python 3.13](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Clojure](https://img.shields.io/badge/Clojure-588137?style=for-the-badge&logo=clojure&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### 📂 Service breakdown
- **`/erp-frontend`**: High-performance SPA built with **Next.js**, React 19, and Tailwind CSS.
- **`/erp` (Java/Spring Boot)**: The primary orchestrator. Handles **JWT Authentication**, global data persistence, and RBAC enforcement.
- **`/erp-ai` (Python/FastAPI)**: The intelligence layer. Powers persona-driven insights, invoice risk analysis, and privacy-preserving peer benchmarking.
- **`/erp-rules` (Clojure)**: The functional rules engine. Manages complex financial settlement logic, settlement discounts, and internal marketplace recommendations.

---

## 🛡️ Enterprise-Grade Features

### 1. Advanced RBAC (5 Standard Roles)
Comprehensive data isolation and feature-gating tailored for:
- **System Admin**: Infrastructure and global user management.
- **Manager**: Business oversight, revenue trends, and risk reports.
- **Accountant**: Financial operations, settlements, and VAT reconciliation.
- **Recovery Agent**: Specialized debt collection and case management.
- **Client**: Self-service portal for invoices, payments, and marketplace discovery.

### 2. AI-Driven Financial Intelligence
- **Invoice Risk Scoring**: Predictive flagging of approach financial constraints.
- **Persona Insights**: Role-specific intelligence delivered directly via the dashboard.
- **Peer Comparison**: Anonymized benchmarking to track payment performance regardless of industry.

### 3. Smart Settlement Rules
- **Automated Discounting**: Functional rules to reward early payments.
- **Priority Recovery**: Weighted case ranking for debt recovery agents.

---

## 📖 API Documentation

### Interactive Swagger UI
- **Java Core**: `http://localhost:8080/swagger-ui/index.html`
- **Python AI**: `http://localhost:8000/docs`

### Postman Collection
A pre-configured Postman collection is available for rapid onboarding:
- `SmartFlow-ERP.postman_collection.json` (Includes 15+ endpoints across all services).

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
cd erp-frontend
npm install
npm run dev
```

### 2. Java Backend Setup
```bash
cd erp
mvn spring-boot:run
```

### 3. Python AI Setup
```bash
cd erp-ai
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Clojure Rules Engine Setup
```bash
cd erp-rules
mvn compile clojure:run
```

---

## 📄 License
SmartFlow ERP is open-source software licensed under the **MIT License**.
