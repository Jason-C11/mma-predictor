import pandas as pd
from pathlib import Path
from bson import ObjectId
import sys
from backend.db.mongo import fighters_collection
from backend.models.fighter import Fighter


BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))
csv_path = BASE_DIR / "data" / "career_avg_stats.csv"


def populate_fighters(csv_path):
    df = pd.read_csv(csv_path)

    # Create name → id map from existing records
    existing_fighters = {
        doc["fighter_name"]: doc["fighter_id"]
        for doc in fighters_collection.find({}, {"fighter_name": 1, "fighter_id": 1})
    }

    for _, row in df.iterrows():
        fighter_name = str(row["fighter"]).strip()

        # Reuse fighter_id if exists
        fighter_id = existing_fighters.get(fighter_name, str(ObjectId()))

        fighter = Fighter(
            fighter_id=fighter_id,
            fighter_name=fighter_name
        )

        fighters_collection.update_one(
            {"fighter_id": fighter_id},
            {"$set": fighter.model_dump()},
            upsert=True
        )

        # Update mapping in case new ones were added
        existing_fighters[fighter_name] = fighter_id

    print(f"Inserted/updated {len(df)} fighters into MongoDB.")


if __name__ == "__main__":
    populate_fighters(csv_path)
