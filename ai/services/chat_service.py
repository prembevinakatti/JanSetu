from services.intent_service import parse_query
from services.complaint_service import find_complaints, count_complaints
from services.analytics_service import get_hotspots


async def process_chat(message: str):

    parsed = parse_query(message)

    # COUNT QUERY
    if parsed["type"] == "count":
        count = count_complaints(parsed["query"])
        return {
            "type": "text",
            "data": f"There are {count} matching complaints."
        }

    # HOTSPOT QUERY
    if parsed["type"] == "hotspot":
        hotspots = get_hotspots()
        return {
            "type": "hotspots",
            "data": hotspots
        }

    # FIND QUERY
    if parsed["type"] == "find":
        complaints = find_complaints(
            parsed["query"],
            parsed["limit"]
        )

        if not complaints:
            return {
                "type": "text",
                "data": "No matching complaints found."
            }

        return {
            "type": "complaints",
            "data": complaints
        }

    return {
        "type": "text",
        "data": "I couldn't understand your query."
    }