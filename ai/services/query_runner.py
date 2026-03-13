from utils.db import issues_collection

def run_query(query):

    if not query:
        return {"message": "Invalid query"}

    qtype = query.get("type")
    filters = query.get("filters", {})
    limit = query.get("limit", 10)

    if qtype == "count":

        count = issues_collection.count_documents(filters)

        return {
            "type": "count",
            "value": count
        }

    elif qtype == "find":

        results = list(
            issues_collection.find(filters).limit(limit)
        )

        for r in results:
            r["_id"] = str(r["_id"])

        return {
            "type": "complaints",
            "data": results
        }

    return {"message": "Unknown query type"}