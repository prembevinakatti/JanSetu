# services/priority_engine.py

def calculate_priority(
    sentiment_score,
    text=None,
    cluster_size=1,
    is_emergency=False
):

    base_score = sentiment_score * 50

    if text:
        critical_keywords = [
            "infect",
            "accident",
            "fire",
            "danger",
            "injury",
            "flood",
            "overflow",
            "garbage"
        ]

        if any(word in text.lower() for word in critical_keywords):
            base_score += 25

    base_score += min(cluster_size * 7, 20)

    if is_emergency:
        base_score += 30

    base_score = min(base_score, 100)

    if base_score >= 70:
        level = "High"
    elif base_score >= 45:
        level = "Medium"
    else:
        level = "Low"

    return {
        "score": round(base_score, 2),
        "level": level
    }