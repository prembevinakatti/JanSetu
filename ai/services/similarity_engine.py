from sklearn.metrics.pairwise import cosine_similarity
import uuid
from utils.db import issues_collection

SIMILARITY_THRESHOLD = 0.80

def detect_similar(new_embedding):

    existing_issues = list(
        issues_collection.find({}, {"embedding": 1, "clusterId": 1})
    )

    best_score = 0
    best_cluster_id = None
    cluster_size = 1

    for issue in existing_issues:
        if "embedding" in issue:

            score = cosine_similarity(
                [new_embedding],
                [issue["embedding"]]
            )[0][0]

            if score > best_score:
                best_score = score
                best_cluster_id = issue.get("clusterId")

    # ✅ If similar complaint found
    if best_score >= SIMILARITY_THRESHOLD and best_cluster_id:
        cluster_size = issues_collection.count_documents({
            "clusterId": best_cluster_id
        }) + 1

        return {
            "clusterId": best_cluster_id,
            "clusterSize": cluster_size,
            "similarityScore": float(best_score)
        }

    # ❌ Create new cluster
    new_cluster = str(uuid.uuid4())

    return {
        "clusterId": new_cluster,
        "clusterSize": 1,
        "similarityScore": float(best_score)
    }
