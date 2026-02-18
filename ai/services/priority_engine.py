def calculate_priority(
    sentiment_score,
    text=None,
    is_emergency=False,
    cluster_size=1
):

    # 🔥 Stronger base weight
    base_score = sentiment_score * 50

    # ⚠️ Smart keyword detection (partial match)
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

    # 📈 Cluster boost
    base_score += min(cluster_size * 7, 20)

    # 🚨 Emergency boost
    if is_emergency:
        base_score += 30

    # Cap
    base_score = min(base_score, 100)

    # Priority levels (more realistic)
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
