import pandas as pd
from pathlib import Path
import sys
import hashlib

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))
csv_path = BASE_DIR / "data" / "ufc_fighter_history.csv"

from backend.db.mongo import fighters_collection
from backend.db.mongo import fighter_history_collection
from backend.models.fighter_history import FighterHistory

def as_str(value):
    """Convert any value to string and strip whitespace."""
    return str(value).strip() if value is not None else ""

def generate_fight_id(fighter_name, opponent_name, event):
    """Generate a unique fight_id from fighter, opponent, and event."""
    unique_str = f"{fighter_name}|{opponent_name}|{event}"
    return hashlib.md5(unique_str.encode()).hexdigest()

def populate_fighter_history(csv_path):
    df = pd.read_csv(csv_path)
    df = df.map(lambda x: x.strip() if isinstance(x, str) else x)

    fighter_map = {
        doc["fighter_name"]: doc["fighter_id"]
        for doc in fighters_collection.find({}, {"fighter_name": 1, "fighter_id": 1})
    }

    missing_fighters = []

    for _, row in df.iterrows():
        fighter_name = as_str(row["fighter_name"])
        opponent_name = as_str(row["opponent_name"])
        event = as_str(row["event"])

        fighter_id = fighter_map.get(fighter_name)
        if not fighter_id:
            missing_fighters.append(fighter_name)
            continue  # Skip if fighter not found

        fight_id = generate_fight_id(fighter_name, opponent_name, event)

        fighter_record = FighterHistory(
            fighter_id=fighter_id,
            fighter_name=fighter_name,
            opponent_name=opponent_name,
            event=event,
            weightclass=as_str(row["weightclass"]),
            method=as_str(row["method"]),
            round_=as_str(row["round"]),
            time=as_str(row["time"]),
            time_format=as_str(row["time_format"]),
            details=as_str(row["details"]),
            outcome=as_str(row["outcome"]),
        )

        fighter_history_collection.update_one(
            {"fight_id": fight_id},
            {"$set": fighter_record.model_dump()},
            upsert=True
        )

    if missing_fighters:
        print(f"⚠️ Missing {len(missing_fighters)} fighters (not found in fighters collection):")
        for name in missing_fighters:
            print(f" - {name}")

if __name__ == "__main__":
    populate_fighter_history(csv_path)
