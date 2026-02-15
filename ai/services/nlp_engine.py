from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")

def analyze_text(text: str):

    sentiment_result = sentiment_pipeline(text)[0]

    return {
        "sentiment": {
            "label": sentiment_result["label"],
            "score": float(sentiment_result["score"])
        }
    }