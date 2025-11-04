from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ml.predict import predict_fight
from db.mongo import fighters_career_avgs_collection, fighters_collection
from ml.models_loader import get_winner_model
router = APIRouter()


def format_fighter_data(fighter) -> dict:
    return {
        "id": str(fighter["_id"]),
        "fighter_id": fighter["fighter_id"],
        "fighter_name": fighter["fighter_name"],
    }


@router.get("/fighters")
def get_fighters():

    fighters = fighters_collection.find()
    if not fighters:
        raise HTTPException(status_code=500, detail="Server Error")
    return [format_fighter_data(f) for f in fighters]


#Get fighter stats given a fighter_id 
# @router.get("/fighters/stats")
# def get_fighter_stats(fighter_id):
#     try:
#         fighter_data = fighters_career_avgs_collection.find_one({"fighter_id" : fighter_id})
#         return format_fighter_data(fighter_data)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))
    


#Given two fighter ids predicts and returns the winner
@router.get("/predict")
def fight_prediction(fighter1_id, fighter2_id, model):
    try:
        model = get_winner_model(model)
        return predict_fight(fighter1_id, fighter2_id, model)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    