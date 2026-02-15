def calculate_priority(sentiment_score, is_emergency=False, hotspot_boost=0):

    base_score = sentiment_score * 50

    if is_emergency:
        base_score += 40

    base_score += hotspot_boost

    if base_score > 70:
        level = "High"
    elif base_score > 40:
        level = "Medium"
    else:
        level = "Low"

    return {
        "score": round(base_score, 2),
        "level": level
    }