from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional
import random
import time
import os

app = FastAPI(title="YePAI Climbing Grade Predictor API")

# Add CORS middleware to allow requests from Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ideally, replace with your Vercel app URL in production
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
    print(route.image_url)
    print(route.hold_color)
    """
    Predicts the climbing grade of a route based on image and hold color.
    
    This is a placeholder implementation that returns a random grade.
    In a real implementation, this would use a machine learning model to predict the grade.
    """
    try:
        # Placeholder for ML model
        # In a real implementation, you would:
        # 1. Download the image from the image_url
        # 2. Preprocess the image
        # 3. Pass it to your ML model along with the hold color
        # 4. Return the predicted grade
        
        # Dummy grades for testing
        grades = ["5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d"]
        predicted_grade = random.choice(grades)
        # Simulate processing time
        time.sleep(2)  # Reduced from 5 seconds to 2 for better user experience
        return {
            "grade": predicted_grade,
            "confidence": random.random()  # Random confidence between 0 and 1
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting grade: {str(e)}")

if __name__ == "__main__":
    # Get port from environment variable for Heroku compatibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port) 