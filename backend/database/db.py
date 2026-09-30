import pymongo
from backend.config import MONGO_URI, DB_NAME
from backend.utils.logging import logger

class DatabaseManager:
    """
    MongoDB Database Manager with graceful in-memory fallback store
    if PyMongo/MongoDB daemon is unreachable.
    """
    def __init__(self, uri=MONGO_URI, db_name=DB_NAME):
        self.uri = uri
        self.db_name = db_name
        self.use_mongo = False
        self.memory_store = {
            "banks": [],
            "experiments": [],
            "round_metrics": [],
            "trust_scores": [],
            "attack_events": [],
            "model_results": []
        }
        self.connect()

    def connect(self):
        try:
            self.client = pymongo.MongoClient(self.uri, serverSelectionTimeoutMS=2000)
            self.client.server_info()  # Trigger connection check
            self.db = self.client[self.db_name]
            self.use_mongo = True
            logger.info(f"Successfully connected to MongoDB database '{self.db_name}' at {self.uri}")
        except Exception as e:
            self.use_mongo = False
            logger.warning(f"MongoDB connection failed ({e}). Operating in resilient IN-MEMORY database mode.")

    def insert_one(self, collection_name, document):
        if self.use_mongo:
            try:
                res = self.db[collection_name].insert_one(document)
                return str(res.inserted_id)
            except Exception as e:
                logger.error(f"MongoDB insert error: {e}")
        # In-Memory Fallback
        if collection_name not in self.memory_store:
            self.memory_store[collection_name] = []
        self.memory_store[collection_name].append(document)
        return str(len(self.memory_store[collection_name]))

    def find_all(self, collection_name, query=None, limit=100):
        if self.use_mongo:
            try:
                cursor = self.db[collection_name].find(query or {}).limit(limit)
                docs = list(cursor)
                for d in docs:
                    d["_id"] = str(d["_id"])
                return docs
            except Exception as e:
                logger.error(f"MongoDB find error: {e}")
        # In-Memory Fallback
        items = self.memory_store.get(collection_name, [])
        return items[:limit]

    def clear_collection(self, collection_name):
        if self.use_mongo:
            try:
                self.db[collection_name].delete_many({})
            except Exception:
                pass
        self.memory_store[collection_name] = []

db_manager = DatabaseManager()
