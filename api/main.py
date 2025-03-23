from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional
import random
import time
import os
from Model.final import call

app = FastAPI(title="YePAI Climbing Grade Predictor API")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_ORIGINS", "*")],  # Use environment variable for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RouteInput(BaseModel):
    image_url: str
    hold_color: str

class GradePrediction(BaseModel):
    grade: str
    confidence: Optional[float] = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "online", "message": "YePAI Climbing Grade Predictor API is running"}

@app.post("/api/upload", response_model=GradePrediction)
async def predict_grade(route: RouteInput):
    try:
        predicted_grade = call(route.image_url, route.hold_color)
        return {
            "grade": predicted_grade,
            "confidence": random.random()  # Random confidence between 0 and 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting grade: {str(e)}")

if __name__ == "__main__":
    # Get port from environment variable for Railway compatibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port) 