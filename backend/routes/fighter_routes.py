from fastapi import APIRouter, HTTPException
from typing import Dict
from ml.predict import predict_fight
from ml.models_loader import get_winner_model
from db.fighters_repo import get_all_fighters, get_fighter_avgs_with_info, get_fighter_history

router = APIRouter()


@router.get("/fighters")
def get_fighters():
    try:
        fighters = get_all_fighters()
        return fighters
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/fighters/stats")
def get_fighter_stats(fighter_id: str):
    try:
        fighter_data = get_fighter_avgs_with_info(fighter_id)
        return fighter_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@router.get("/fighters/history")
def get_fighter_hist(fighter_id: str):
    try:
        fighter_history = get_fighter_history(fighter_id)
        return fighter_history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/predict")
def fight_prediction(fighter1_id: str, fighter2_id: str, model: str):
    try:
        model_obj = get_winner_model(model)
        return predict_fight(fighter1_id, fighter2_id, model_obj)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

