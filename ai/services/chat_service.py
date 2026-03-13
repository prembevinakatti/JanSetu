from services.rag_service import generate_answer
from utils.db import issues_collection
from collections import Counter


async def process_chat(message: str):

    msg = message.lower()

    # 🔥 HOTSPOT QUERY
    if (
        "most complaints" in msg
        or "hotspot" in msg
        or "which area" in msg
        or "which location" in msg
    ):

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

    # 🔥 HIGH PRIORITY COUNT
    if ("high priority" in msg and "count" in msg) or ("total high priority" in msg):

        count = issues_collection.count_documents({
            "priorityLevel": "High"
        })

        return {
            "type": "count",
            "priority": "High",
            "total": count
        }

    # 🔥 SHOW HIGH PRIORITY COMPLAINTS
    if "high priority complaints" in msg:

        complaints = list(
            issues_collection.find(
                {"priorityLevel": "High"},
                {"title": 1, "status": 1, "category": 1, "address": 1}
            ).limit(10)
        )

        if not complaints:
            return {
                "type": "text",
                "message": "No high priority complaints found."
            }

        data = []

        for c in complaints:
            data.append({
                "title": c.get("title"),
                "status": c.get("status"),
                "category": c.get("category"),
                "location": c.get("address")
            })

        return {
            "type": "complaints",
            "total": len(data),
            "data": data
        }

    # 🔥 TOTAL COMPLAINTS
    if "total complaints" in msg or "how many complaints" in msg:

        count = issues_collection.count_documents({})

        return {
            "type": "count",
            "total": count
        }

    # 🔥 OTHERWISE USE LLM
    answer = generate_answer(message)

    if isinstance(answer, dict):
        return answer

    return {
        "type": "text",
        "message": answer
    }