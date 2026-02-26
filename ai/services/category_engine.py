# services/category_engine.py

def derive_category_from_tags(tags):

    if not tags:
        return "General"

    # Priority-based category decision
    if "Emergency" in tags:
        return "Emergency"
    if "Health" in tags:
        return "Health"
    if "Sanitation" in tags:
        return "Sanitation"
    if "Water" in tags:
        return "Water"
    if "Road" in tags:
        return "Road"
    if "Electricity" in tags:
        return "Electricity"

    return tags[0]