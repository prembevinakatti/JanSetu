from utils.db import issues_collection
from utils.serializer import serialize_list


def build_combined_filter(filters):
    """
    Supports both web schema and email schema
    """

    combined = []

    # Priority
    if "priorityLevel" in filters:
        combined.append({"priorityLevel": filters["priorityLevel"]})
        combined.append({"aiPriorityLevel": filters["priorityLevel"]})

    # Status
    if "status" in filters:
        combined.append({"status": filters["status"]})

    # Location
    if "location" in filters:
        combined.append({"location": filters["location"]})
        combined.append({"address": {"$regex": filters["location"], "$options": "i"}})

    # If no special fields, just return original filters
    if not combined:
        return filters

    return {"$or": combined}


def find_complaints(filters, limit=10):

    mongo_filter = build_combined_filter(filters)

    complaints = list(
        issues_collection
        .find(mongo_filter)
        .sort("createdAt", -1)
        .limit(limit)
    )

    return serialize_list(complaints)


def count_complaints(filters):

    mongo_filter = build_combined_filter(filters)

    return issues_collection.count_documents(mongo_filter)