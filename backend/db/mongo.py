from pymongo import MongoClient, ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "ufc")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

fighters_career_avgs_collection = db["fighter_career_avgs"]
fighters_career_avgs_collection.create_index("fighter_id", unique=True)

fight_results_collection = db["fight_results"]
fight_results_collection.create_index("fight_id", unique=True)

fighters_collection = db["fighters"]
fighters_collection.create_index("fighter_id", unique=True)

fighters_collection.create_index([("fighter_name", ASCENDING)])
