from utils.db import issues_collection
from math import radians, cos, sin, sqrt, atan2

# Distance in kilometers
EARTH_RADIUS = 6371
HOTSPOT_RADIUS_KM = 1.0  # complaints within 1 km considered same hotspot
MIN_HOTSPOT_COUNT = 3    # minimum complaints to mark hotspot


def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two geo points
    """

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2 +
        cos(radians(lat1)) *
        cos(radians(lat2)) *
        sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return EARTH_RADIUS * c


def detect_hotspots():

    issues = list(
        issues_collection.find(
            {},
            {"latitude": 1, "longitude": 1, "priorityLevel": 1}
        )
    )

    hotspots = []

    for issue in issues:

        lat1 = issue.get("latitude")
        lon1 = issue.get("longitude")

        if lat1 is None or lon1 is None:
            continue

        count = 0
        high_priority_count = 0

        for other in issues:

            lat2 = other.get("latitude")
            lon2 = other.get("longitude")

            if lat2 is None or lon2 is None:
                continue

            distance = haversine(lat1, lon1, lat2, lon2)

            if distance <= HOTSPOT_RADIUS_KM:
                count += 1

                if other.get("priorityLevel") == "High":
                    high_priority_count += 1

        if count >= MIN_HOTSPOT_COUNT:
            hotspots.append({
                "centerLat": lat1,
                "centerLng": lon1,
                "totalComplaints": count,
                "highPriorityCount": high_priority_count
            })

    return hotspots