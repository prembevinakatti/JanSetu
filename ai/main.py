from fastapi import FastAPI
from pydantic import BaseModel
from model_utils import analyze_text

app = FastAPI()

class Complaint(BaseModel):
    text: str

@app.post("/analyze")
def analyze_complaint(data: Complaint):
    result = analyze_text(data.text)
    return result
