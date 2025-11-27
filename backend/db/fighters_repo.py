from typing import Optional, List, Dict
from db.mongo import fighters_career_avgs_collection, fighters_collection, fighter_history_collection
from models.fighter_career_avg import FighterCareerAvg 

def get_all_fighters() -> List[Dict]:
    fighters = list(fighters_collection.find())
    return [format_fighter(f) for f in fighters]

def get_fighter_by_id(fighter_id: str) -> Optional[Dict]:
    return fighters_collection.find_one({"fighter_id": fighter_id})

def get_fighter_avgs_by_id(fighter_id: str) -> Optional[Dict]:
    fighter_avg_data = fighters_career_avgs_collection.find_one({"fighter_id": fighter_id})
    if fighter_avg_data:
        return format_fighter_avgs(fighter_avg_data)
    return None


def get_fighter_avgs_with_info(fighter_id: str) -> Optional[Dict]:
    """
    Fetch fighter career averages and join with general fighter info.
    Returns a single formatted dict.
    """
    pipeline = [
        {"$match": {"fighter_id": fighter_id}},
        {
            "$lookup": {
                "from": "fighters",
                "localField": "fighter_id",
                "foreignField": "fighter_id",
                "as": "fighter_info"
            }
        },
        {"$unwind": {"path": "$fighter_info", "preserveNullAndEmptyArrays": True}}
    ]

    result = list(fighters_career_avgs_collection.aggregate(pipeline))
    if not result:
        return None

    fighter = result[0]

    formatted = {
        # Fighter info fields
        "fighter_id": fighter.get("fighter_id"),
        "fighter_name": fighter.get("fighter_info", {}).get("fighter_name") or fighter.get("fighter"),
        "height": fighter.get("fighter_info", {}).get("height"),
        "dob": fighter.get("fighter_info", {}).get("dob"),
        "reach": fighter.get("fighter_info", {}).get("reach"),
        "stance": fighter.get("fighter_info", {}).get("stance"),
        #==== Averages
        "sig_str_landed": fighter.get("sig_str_landed") or 0,
        "total_str_landed": fighter.get("total_str_landed") or 0,
        "td_landed": fighter.get("td_landed") or 0,
        "head_landed": fighter.get("head_landed") or 0,
        "body_landed": fighter.get("body_landed") or 0,
        "leg_landed": fighter.get("leg_landed") or 0,
        "distance_landed": fighter.get("distance_landed") or 0,
        "clinch_landed": fighter.get("clinch_landed") or 0,
        "ground_landed": fighter.get("ground_landed") or 0,
        "sig_str_attempts": fighter.get("sig_str_attempts") or 0,
        "total_str_attempts": fighter.get("total_str_attempts") or 0,
        "td_attempts": fighter.get("td_attempts") or 0,
        "kd": fighter.get("kd") or 0,
        "sub_att": fighter.get("sub_att") or 0,
        "rev": fighter.get("rev") or 0,
        "ctrl_seconds": fighter.get("ctrl_seconds") or 0,
        "sig_str_acc": fighter.get("sig_str_acc") or 0,
        "td_acc": fighter.get("td_acc") or 0,
    }

    return formatted

def get_fighter_history(fighter_id: str) -> Optional[list[dict]]:
    fighter_history = fighter_history_collection.find(
        {"fighter_id": fighter_id},
        {"_id": 0} 
    ).sort("_id", 1)

    fighter_history_list = list(fighter_history)

    return fighter_history_list



#==================Formatting Helpers===============================
def format_fighter(fighter: dict) -> dict:
    return {
        "id": str(fighter["_id"]),
        "fighter_id": fighter["fighter_id"],
        "fighter_name": fighter.get("fighter_name") or fighter.get("fighter")  
    }

def format_fighter_avgs(fighter: dict) -> Dict[str, float]:
    """
    Accepts a dict from MongoDB and formats numeric fields.
    Converts None to 0.
    """
    fields = [
        "fighter_id", "fighter", "sig_str_landed", "total_str_landed", "td_landed",
        "head_landed", "body_landed", "leg_landed", "distance_landed", "clinch_landed",
        "ground_landed", "sig_str_attempts", "total_str_attempts", "td_attempts",
        "kd", "sub_att", "rev", "ctrl_seconds", "sig_str_acc", "td_acc"
    ]
    return {field: fighter.get(field, 0) or 0 for field in fields}




