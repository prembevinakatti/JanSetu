from utils.db import issues_collection
from collections import Counter

async def get_hotspots():
    complaints = await complaints_collection.find().to_list(length=1000)

    locations = [c["location"] for c in complaints if "location" in c]

    hotspot_data = Counter(locations)

    return hotspot_data.most_common(5)