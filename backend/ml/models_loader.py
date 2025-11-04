import joblib
import os

ml_path = os.path.join(os.path.dirname(__file__), "models")


winner_models = {
    "LightGBM" : joblib.load(os.path.join(ml_path, "lgb_model.pkl")),
    "Random Forest" : joblib.load(os.path.join(ml_path, "rf_model.pkl")),
    "XGBoost" : joblib.load(os.path.join(ml_path, "xgb_model.pkl"))  
}

def get_winner_model(name: str):
    return winner_models.get(name)