import pandas as pd
from pathlib import Path
from bson import ObjectId
import sys


BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))
csv_path = BASE_DIR / "data" / "career_avg_stats.csv"

from backend.db.mongo import fighters_career_avgs_collection
from backend.models.fighter_career_avg import FighterCareerAvg
from backend.db.mongo import fighters_collection

def populate_fighter_career_avgs(csv_path):
    df = pd.read_csv(csv_path)
    fighter_map = {
        doc["fighter_name"]: doc["fighter_id"]
        for doc in fighters_collection.find({}, {"fighter_name": 1, "fighter_id": 1})
    }
    missing_fighters = []

    for _, row in df.iterrows():
        fighter_name = str(row["fighter"]).strip()
        fighter_id = fighter_map.get(fighter_name)

        if not fighter_id:
            missing_fighters.append(fighter_name)
            continue  # Skip if fighter not found in fighters collection


        fighter = FighterCareerAvg(
            fighter_id=fighter_id,
            fighter=row["fighter"],
            sig_str_landed=float(row["sig_str_landed"]) if pd.notna(row["sig_str_landed"]) else None,
            total_str_landed=float(row["total_str_landed"]) if pd.notna(row["total_str_landed"]) else None,
            td_landed=float(row["td_landed"]) if pd.notna(row["td_landed"]) else None,
            head_landed=float(row["head_landed"]) if pd.notna(row["head_landed"]) else None,
            body_landed=float(row["body_landed"]) if pd.notna(row["body_landed"]) else None,
            leg_landed=float(row["leg_landed"]) if pd.notna(row["leg_landed"]) else None,
            distance_landed=float(row["distance_landed"]) if pd.notna(row["distance_landed"]) else None,
            clinch_landed=float(row["clinch_landed"]) if pd.notna(row["clinch_landed"]) else None,
            ground_landed=float(row["ground_landed"]) if pd.notna(row["ground_landed"]) else None,
            sig_str_attempts=float(row["sig_str_attempts"]) if pd.notna(row["sig_str_attempts"]) else None,
            total_str_attempts=float(row["total_str_attempts"]) if pd.notna(row["total_str_attempts"]) else None,
            td_attempts=float(row["td_attempts"]) if pd.notna(row["td_attempts"]) else None,
            kd=float(row["kd"]) if pd.notna(row["kd"]) else None,
            sub_att=float(row["sub_att"]) if pd.notna(row["sub_att"]) else None,
            rev=float(row["rev"]) if pd.notna(row["rev"]) else None,
            ctrl_seconds=float(row["ctrl_seconds"]) if pd.notna(row["ctrl_seconds"]) else None,
            sig_str_acc=float(row["sig_str_acc"]) if pd.notna(row["sig_str_acc"]) else None,
            td_acc=float(row["td_acc"]) if pd.notna(row["td_acc"]) else None
        )

        fighters_career_avgs_collection.update_one(
            {"fighter_id": fighter_id},
            {"$set": fighter.model_dump()},
            upsert=True
        )
    

    print(f"Inserted/updated {len(df) - len(missing_fighters)} fighters into MongoDB.")
    if missing_fighters:
        print(f"⚠️ Missing {len(missing_fighters)} fighters (not found in fighters collection):")
        for name in missing_fighters:
            print(f" - {name}")


if __name__ == "__main__":
    populate_fighter_career_avgs(csv_path)
