from bson import ObjectId
from datetime import datetime

def clean_document(doc):
    cleaned = {}

    for key, value in doc.items():

        if isinstance(value, ObjectId):
            cleaned[key] = str(value)

        elif isinstance(value, datetime):
            cleaned[key] = value.isoformat()

        else:
            cleaned[key] = value

    return cleaned


def serialize_list(docs):
    return [clean_document(doc) for doc in docs]