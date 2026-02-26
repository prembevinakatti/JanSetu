# services/category_engine.py

def derive_category_from_tags(tags):

    if not tags:
        return "General"

    priority_order = [
        "Emergency",
        "Health",
        "Sanitation",
        "Water",
        "Road",
        "Electricity"
    ]

    for cat in priority_order:
        if cat in tags:
            return cat

    return tags[0]