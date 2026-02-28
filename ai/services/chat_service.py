from services.rag_service import generate_answer
from utils.db import issues_collection
from collections import Counter


async def process_chat(message: str):

    msg = message.lower()

    # 🔥 HANDLE HOTSPOT DIRECTLY (NO LLM)
    if "most complaints" in msg or "hotspot" in msg or "which area" in msg or "which location" in msg:

        complaints = list(
            issues_collection.find({}, {"address": 1, "location": 1})
        )

        locations = []

        for c in complaints:
            loc = c.get("address") or c.get("location")
            if loc:
                locations.append(loc)

        if not locations:
            return {
                "type": "text",
                "message": "No location data available."
            }

        counter = Counter(locations)
        hotspot_location, count = counter.most_common(1)[0]

        return {
            "type": "hotspot",
            "location": hotspot_location,
            "count": count
        }

    # 🔥 OTHERWISE USE LLM
    answer = generate_answer(message)

    if isinstance(answer, dict):
        return answer

    return {
        "type": "text",
        "message": answer
    }