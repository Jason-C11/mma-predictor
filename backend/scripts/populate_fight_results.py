import pandas as pd
import os
import uuid
from db.mongo import fight_results_collection
from models.fight_result import FightResult  

# 1. Load CSV
data_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fight_results.csv")
df = pd.read_csv(data_path)

# 2. Normalize column names
df = df.rename(columns={
    "EVENT": "event",
    "BOUT": "bout",
    "OUTCOME": "outcome",
    "WEIGHTCLASS": "weightclass",
    "METHOD": "method",
    "ROUND": "round",
    "TIME": "time",
    "TIME FORMAT": "time_format",
    "REFEREE": "referee",
    "DETAILS": "details",
    "URL": "url"
})

# 3. Ensure unique index on event+bout
fight_results_collection.create_index([("event", 1), ("bout", 1)], unique=True)

# 4. Insert/Update each fight result using Pydantic model
for _, row in df.iterrows():
    fight = FightResult(
        event=row["event"],
        bout=row["bout"],
        outcome=row["outcome"],
        weightclass=row["weightclass"],
        method=row["method"],
        round=int(row["round"]) if pd.notna(row["round"]) else 0,
        time=row["time"],
        time_format=row["time_format"],
        referee=row["referee"] if pd.notna(row["referee"]) else None,
        details=row["details"] if pd.notna(row["details"]) else None,
        url=row["url"]
    )

    fight_dict = fight.model_dump()  # convert to dict for MongoDB

    # Ensure each fight has a unique fight_id
    if "fight_id" not in fight_dict or not fight_dict.get("fight_id"):
        fight_dict["fight_id"] = str(uuid.uuid4())

    fight_results_collection.update_one(
        {"event": fight.event, "bout": fight.bout},
        {"$set": fight_dict},
        upsert=True
    )

print("✅ fight_results upserted into MongoDB")
