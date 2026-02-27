import re

def parse_query(message: str):
    msg = message.lower()

    query = {}
    limit = 10

    # Extract number
    number_match = re.search(r'\d+', msg)
    if number_match:
        limit = int(number_match.group())

    # Priority
    if "high" in msg:
        query["priorityLevel"] = "High"
    elif "medium" in msg:
        query["priorityLevel"] = "Medium"
    elif "low" in msg:
        query["priorityLevel"] = "Low"

    # Status
    if "open" in msg:
        query["status"] = "Open"
    elif "resolved" in msg:
        query["status"] = "Resolved"
    elif "reported" in msg:
        query["status"] = "Reported"
    elif "progress" in msg:
        query["status"] = "InProgress"

    # Location detection (simple example)
    location_match = re.search(r'in ([a-zA-Z ]+)', msg)
    if location_match:
        query["location"] = location_match.group(1).strip().title()

    # Count intent
    if "how many" in msg or "count" in msg:
        return {
            "type": "count",
            "query": query
        }

    # Hotspot intent
    if "hotspot" in msg or "most complaints" in msg:
        return {
            "type": "hotspot"
        }

    # Default → return filtered complaints
    return {
        "type": "find",
        "query": query,
        "limit": limit
    }