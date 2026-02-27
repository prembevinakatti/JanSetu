from utils.db import issues_collection
from collections import Counter

def get_hotspots():
    complaints = list(issues_collection.find({}, {"location": 1}))
    locations = [c.get("location") for c in complaints if c.get("location")]

    counter = Counter(locations)

    return counter.most_common(5)