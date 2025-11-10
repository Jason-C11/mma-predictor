import numpy as np
import pandas as pd
from db.fighters_repo import get_all_fighters, get_fighter_avgs_by_id



# Feature columns used during training
all_features = ['sig_str_landed_fighter1', 'total_str_landed_fighter1',
       'td_landed_fighter1', 'head_landed_fighter1', 'body_landed_fighter1',
       'leg_landed_fighter1', 'distance_landed_fighter1',
       'clinch_landed_fighter1', 'ground_landed_fighter1',
       'sig_str_attempts_fighter1', 'total_str_attempts_fighter1',
       'td_attempts_fighter1', 'kd_fighter1', 'sub_att_fighter1',
       'rev_fighter1', 'ctrl_seconds_fighter1', 'sig_str_acc_fighter1',
       'td_acc_fighter1', 'sig_str_landed_fighter2',
       'total_str_landed_fighter2', 'td_landed_fighter2',
       'head_landed_fighter2', 'body_landed_fighter2', 'leg_landed_fighter2',
       'distance_landed_fighter2', 'clinch_landed_fighter2',
       'ground_landed_fighter2', 'sig_str_attempts_fighter2',
       'total_str_attempts_fighter2', 'td_attempts_fighter2', 'kd_fighter2',
       'sub_att_fighter2', 'rev_fighter2', 'ctrl_seconds_fighter2',
       'sig_str_acc_fighter2', 'td_acc_fighter2', 'kd_diff',
       'sig_str_landed_diff', 'sig_str_attempts_diff', 'total_str_landed_diff',
       'total_str_attempts_diff', 'td_landed_diff', 'td_attempts_diff',
       'sub_att_diff', 'rev_diff', 'ctrl_seconds_diff', 'head_landed_diff',
       'body_landed_diff', 'leg_landed_diff', 'distance_landed_diff',
       'clinch_landed_diff', 'ground_landed_diff', 'sig_str_acc_diff',
       'td_acc_diff']


def get_fighter_stats(fighter_id: int):
    """Fetch fighter stats from MongoDB by fighter_id"""
    fighter = get_fighter_avgs_by_id(fighter_id)
    if not fighter:
        raise ValueError(f"Fighter with id {fighter_id} not found in DB")
    return fighter

def build_feature_vector(f1_id: int, f2_id: int):
    f1 = get_fighter_stats(f1_id)
    f2 = get_fighter_stats(f2_id)

    f1_name = f1["fighter"]
    f2_name= f2["fighter"]

    #drop fighter_id, _id, fighter_name
    drop_cols = ["fighter_id", "fighter"]
    
    for key in drop_cols:
        del f1[key]
        del f2[key]

    feat_vect = {}
    # Rename keys and add to vector
    for key, val in f1.items():
        feat_vect[key + "_fighter1"] = val

    for key, val in f2.items():
        feat_vect[key + "_fighter2"] = val

    #=========
    
    stats = [
    "kd", "sig_str_landed", "sig_str_attempts",
    "total_str_landed", "total_str_attempts",
    "td_landed", "td_attempts", "sub_att", "rev",
    "ctrl_seconds", "head_landed", "body_landed", "leg_landed",
    "distance_landed", "clinch_landed", "ground_landed",
    "sig_str_acc", "td_acc"
    ]
    
    for stat in stats:
        feat_vect[stat + "_diff"] = f1[stat] - f2[stat]
    
    X = pd.DataFrame([feat_vect])[all_features]

    return X, f1_name, f2_name


def predict_fight(f1_id: int, f2_id: int, winner_model, scaler=None):

    X, f1_name, f2_name = build_feature_vector(f1_id, f2_id)
    # Winner prediction
    
    win_pred = winner_model.predict(X)[0]
    
    win_prob = winner_model.predict_proba(X)[0]

    predicted_winner = f1_name if win_pred == 1 else f2_name
    probs = {f1_name: float(win_prob[1]), f2_name: float(win_prob[0])}

    # Method prediction to be included later
    

    return {
        "fighter1": f1_name,
        "fighter2": f2_name,
        "predicted_winner": predicted_winner,
        "probabilities": probs
    }
