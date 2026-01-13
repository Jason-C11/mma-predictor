import numpy as np
import pandas as pd
from db.fighters_repo import get_all_fighters, get_fighter_avgs_by_id



# Feature columns used during training
all_features = ['kd_diff', 'sig_str_landed_diff', 'sig_str_attempts_diff',
       'total_str_landed_diff', 'total_str_attempts_diff', 'td_landed_diff',
       'td_attempts_diff', 'sub_att_diff', 'rev_diff', 'ctrl_seconds_diff',
       'head_landed_diff', 'body_landed_diff', 'leg_landed_diff',
       'distance_landed_diff', 'clinch_landed_diff', 'ground_landed_diff',
       'sig_str_acc_diff', 'td_acc_diff', 'sig_str_landed_ratio',
       'total_str_landed_ratio', 'td_landed_ratio', 'ctrl_seconds_ratio']


def get_fighter_stats(fighter_id: int, recent: bool):
    """Fetch fighter stats from MongoDB by fighter_id"""
    fighter = get_fighter_avgs_by_id(fighter_id, recent)
    if not fighter:
        raise ValueError(f"Fighter with id {fighter_id} not found in DB")
    return fighter

def build_feature_vector(f1_id: int, f2_id: int, recent: bool):
    f1 = get_fighter_stats(f1_id, recent)
    f2 = get_fighter_stats(f2_id, recent)

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

    ratio_stats = ["sig_str_landed", "total_str_landed", "td_landed", "ctrl_seconds"]

    for stat in ratio_stats:
        feat_vect[stat + "_ratio"] = (f1[stat] + 1) / (f2[stat] + 1)


    feat_vect["kd_diff"] = np.clip(feat_vect["kd_diff"], -4, 4)
    feat_vect["ctrl_seconds_diff"] = np.clip(feat_vect["ctrl_seconds_diff"], -800, 800)

    # ======== drop individual fighter stats
    raw_cols = [k for k in feat_vect.keys() if "_fighter1" in k or "_fighter2" in k]
    for k in raw_cols:
        feat_vect.pop(k)

    
    X = pd.DataFrame([feat_vect])[all_features]
    if all_features is not None:
        X = X.reindex(columns=all_features, fill_value=0)
    
    return X, f1_name, f2_name


def predict_fight(f1_id: int, f2_id: int, winner_model, recent, scaler=None):

    X, f1_name, f2_name = build_feature_vector(f1_id, f2_id, recent)
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
