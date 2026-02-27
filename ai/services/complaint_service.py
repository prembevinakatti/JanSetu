from utils.db import issues_collection

def find_complaints(filters, limit=10):
    complaints = list(
        issues_collection
        .find(filters)
        .sort("createdAt", -1)
        .limit(limit)
    )
    return complaints


def count_complaints(filters):
    return issues_collection.count_documents(filters)