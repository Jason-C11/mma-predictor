import pandas as pd
from pathlib import Path
from bson import ObjectId
import sys
from backend.db.mongo import fighters_collection
from backend.models.fighter import Fighter

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))
csv_path = BASE_DIR / "data" / "ufc_fighter_tott.csv"  # updated CSV file

def populate_fighters(csv_path):
    df = pd.read_csv(csv_path)

    # Create name → id map from existing records
    existing_fighters = {
        doc["fighter_name"]: doc["fighter_id"]
        for doc in fighters_collection.find({}, {"fighter_name": 1, "fighter_id": 1})
    }

    for _, row in df.iterrows():
        fighter_name = str(row["FIGHTER"]).strip()  # column in CSV

        # Reuse fighter_id if exists
        fighter_id = existing_fighters.get(fighter_name, str(ObjectId()))

        fighter = Fighter(
            fighter_id=fighter_id,
            fighter_name=fighter_name,
            height=row.get("HEIGHT") if pd.notna(row.get("HEIGHT")) else None,
            weight=row.get("WEIGHT") if pd.notna(row.get("WEIGHT")) else None,
            reach=row.get("REACH") if pd.notna(row.get("REACH")) else None,
            stance=row.get("STANCE") if pd.notna(row.get("STANCE")) else None,
            dob=row.get("DOB") if pd.notna(row.get("DOB")) else None,
        )

        # Upsert into MongoDB
        fighters_collection.update_one(
            {"fighter_id": fighter_id},
            {"$set": fighter.model_dump()},
            upsert=True
        )

        # Update mapping in case new fighters are added
        existing_fighters[fighter_name] = fighter_id

    print(f"Inserted/updated {len(df)} fighters into MongoDB.")


if __name__ == "__main__":
    populate_fighters(csv_path)
