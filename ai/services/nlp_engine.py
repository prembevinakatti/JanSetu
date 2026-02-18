from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_text(text: str):
    result = sentiment_pipeline(text)[0]

    return {
        "label": result["label"],
        "score": float(result["score"])
    }
