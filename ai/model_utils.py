from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
sentiment = pipeline("sentiment-analysis")

CATEGORIES = ["Road", "Sanitation", "Water", "Electricity", "Traffic", "Noise"]

def analyze_text(text: str):

    # Category detection
    category_result = classifier(text, CATEGORIES)
    category = category_result["labels"][0]

    # Sentiment detection
    sentiment_result = sentiment(text)[0]

    # Emergency detection
    emergency_keywords = ["fire", "accident", "electric shock", "collapsed", "blast"]
    is_emergency = any(word in text.lower() for word in emergency_keywords)

    # Severity scoring logic
    severity_score = 0.8 if is_emergency else 0.4

    return {
        "category": category,
        "sentiment": sentiment_result,
        "severity_score": severity_score,
        "is_emergency": is_emergency
    }
