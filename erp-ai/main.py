from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel

from database import get_db, engine

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

# --- AI Logic (Migrated from Java) ---

def calculate_risk(amount: float, days_overdue: int, client_risk_index: int) -> float:
    """Migrated logic from PredictionService.java"""
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

@app.get("/api/v1/ai/insights", response_model=List[Insight])
async def get_insights(db: Session = Depends(get_db)):
    """
    Simulated insight generation. 
    In production, this would query the DB for high-risk invoices.
    """
    # This matches the mock data from AssistantController.java
    return [
        {
            "type": "DEBT_RECOVERY",
            "priority": "HIGH",
            "title": "High Risk Invoice: INV-004",
            "description": "Client StartUp Labs has a risk factor of 0.85. Action recommended: Send firm reminder.",
            "targetId": "INV-004"
        },
        {
            "type": "CASHFLOW",
            "priority": "LOW",
            "title": "Optimize Invoicing Cycles",
            "description": "Suggesting shorter due dates for high-risk clients to improve cashflow."
        }
    ]

@app.post("/api/v1/ai/predict-payment", response_model=PaymentPredictionResponse)
async def predict_payment(invoice_id: str, due_date: str, client_avg_delay: int):
    """Predicts payment date based on historical client behavior"""
    due = datetime.strptime(due_date, "%Y-%m-%d")
    predicted = due + timedelta(days=client_avg_delay)
    
    return {
        "invoice_id": invoice_id,
        "predicted_date": predicted.strftime("%Y-%m-%d"),
        "confidence": 0.92
    }

@app.get("/api/v1/ai/risk/{invoice_id}", response_model=RiskAnalysisResponse)
async def analyze_invoice_risk(invoice_id: str, amount: float, days_overdue: int, client_risk_index: int):
    score = calculate_risk(amount, days_overdue, client_risk_index)
    
    return {
        "invoice_id": invoice_id,
        "risk_score": score,
        "priority": "HIGH" if score > 0.7 else "MEDIUM" if score > 0.4 else "LOW",
        "recommendation": "Firm reminder and credit hold" if score > 0.7 else "Standard follow-up"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
