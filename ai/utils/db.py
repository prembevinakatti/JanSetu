from pymongo import MongoClient

# MongoDB Atlas connection
MONGO_URI = "mongodb+srv://meghanakotambari_db_user:Meghana38368@cluster0.d0inf5r.mongodb.net/?retryWrites=true&w=majority"

# connect to cluster
client = MongoClient(MONGO_URI)

# database
db = client["test"]

# collections
issues_collection = db["issues"]
email_collection = db["emailcomplaints"]
history_collection = db["issuehistories"]

# test connection
try:
    print("✅ MongoDB Atlas Connected")
    print("Total issues:", issues_collection.count_documents({}))
except Exception as e:
    print("MongoDB connection error:", e)