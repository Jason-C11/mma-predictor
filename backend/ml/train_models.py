import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from imblearn.over_sampling import RandomOverSampler

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier


import joblib
import os



#===========================================================
# Load data
#===========================================================

results_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fight_results.csv")
rounds_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fight_stats.csv")
results_df = pd.read_csv(results_path)
rounds_df = pd.read_csv(rounds_path)


#===========================================================
# Helper functions for parsing data
#===========================================================

def parse_attempts(value):
    """Parse 'X of Y' into (landed, attempted)."""
    if isinstance(value, str) and "of" in value:
        try:
            landed, attempted = value.replace(" ", "").split("of")
            return float(landed), float(attempted)
        except:
            pass
    return 0.0, 0.0

def parse_percent(value):
    """Parse '45%' into 0.45."""
    if isinstance(value, str) and "%" in value:
        try:
            return float(value.replace("%", "")) / 100
        except:
            pass
    return np.nan

def time_to_seconds(value):
    """Convert 'MM:SS' string to total seconds."""
    if isinstance(value, str) and ":" in value:
        mins, secs = value.split(":")
        return int(mins) * 60 + float(secs)
    return 0.0

def clean_text(s):
    """General text cleaner: lowercase, trim, collapse spaces."""
    if pd.isna(s):
        return ""
    return " ".join(s.strip().lower().split())

def get_fighter1_win(outcome):
    """Map 'W/L/D' → 1/0."""
    return 1 if str(outcome).split("/")[0].strip() == "W" else 0
    #Draws count as 0 for now

#===========================================================
#Clean columns
#===========================================================
for df in [results_df, rounds_df]:
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")


#===========================================================
#Parse stats at round level
#===========================================================

# Columns of the form 'int of int' 
cols_to_parse = ["sig.str.", "total_str.", "td", "head", "body", "leg", "distance", "clinch", "ground"]
for col in cols_to_parse:
    if col in rounds_df.columns:
        rounds_df[[f"{col}_landed", f"{col}_attempts"]] = rounds_df[col].apply(
            lambda x: pd.Series(parse_attempts(x))
        )

# Percent and time columns
rounds_df = rounds_df.assign(
    **{
        col: rounds_df[col].apply(parse_percent)
        for col in rounds_df.columns if "%" in col
    }
)
if "ctrl" in rounds_df.columns:
    rounds_df["ctrl_seconds"] = rounds_df["ctrl"].apply(time_to_seconds)

# Numeric columns
numeric_cols = ["kd", "sub.att", "rev."]
for col in numeric_cols:
    if col in rounds_df.columns:
        rounds_df[col] = pd.to_numeric(rounds_df[col], errors="coerce").fillna(0)


#===========================================================
#Aggregate stats per fighter over the rounds
#===========================================================

agg_cols = [f"{c}_landed" for c in cols_to_parse] + \
           [f"{c}_attempts" for c in ["sig.str.", "total_str.", "td"]] + \
           ["kd", "sub.att", "rev.", "ctrl_seconds"]

fighter_stats = (
    rounds_df.groupby(["event", "bout", "fighter"], as_index=False)[agg_cols]
    .sum()
)

# Accuracy stats
fighter_stats["sig_str_acc"] = (
    fighter_stats["sig.str._landed"] / fighter_stats["sig.str._attempts"].replace(0, np.nan)
).fillna(0)
fighter_stats["td_acc"] = (
    fighter_stats["td_landed"] / fighter_stats["td_attempts"].replace(0, np.nan)
).fillna(0)

# Clean names
for col in ["event", "bout", "fighter"]:
    fighter_stats[col] = fighter_stats[col].apply(clean_text)
for col in ["event", "bout"]:
    results_df[col] = results_df[col].apply(clean_text)

#===========================================================
#Process fight results and fighter names
#===========================================================
results_df["fighter1_win"] = results_df["outcome"].apply(get_fighter1_win)
results_df[["fighter1_name", "fighter2_name"]] = results_df["bout"].str.split(" vs. ", expand=True)
results_df["fighter1_name"] = results_df["fighter1_name"].apply(clean_text)
results_df["fighter2_name"] = results_df["fighter2_name"].apply(clean_text)

#===========================================================
#Merge fighter stats to single row
#===========================================================

fighter1_stats = results_df.merge(
    fighter_stats, left_on=["event", "bout", "fighter1_name"],
    right_on=["event", "bout", "fighter"], how="left"
)
full_df = fighter1_stats.merge(
    fighter_stats, left_on=["event", "bout", "fighter2_name"],
    right_on=["event", "bout", "fighter"], how="left",
    suffixes=("_fighter1", "_fighter2")
)
full_df.drop(columns=["fighter_fighter1", "fighter_fighter2"], inplace=True, errors="ignore")

#===========================================================
# Column clean up
#===========================================================

full_df.columns = (
    full_df.columns
    .str.replace(".", "_", regex=False)
    .str.replace("__", "_", regex=False)
    .str.rstrip("_")
)

#===========================================================
#Create stat difference columns
#===========================================================

stat_cols = [
    "kd", "sig_str_landed", "sig_str_attempts",
    "total_str_landed", "total_str_attempts",
    "td_landed", "td_attempts", "sub_att", "rev",
    "ctrl_seconds", "head_landed", "body_landed", "leg_landed",
    "distance_landed", "clinch_landed", "ground_landed",
    "sig_str_acc", "td_acc"
]
for col in stat_cols:
    full_df[f"{col}_diff"] = full_df[f"{col}_fighter1"] - full_df[f"{col}_fighter2"]

diff_cols = [f"{c}_diff" for c in stat_cols]

#===========================================================
#Train/test split & oversampling & augmentation swap
#===========================================================

drop_cols = [
    'event', 'bout', 'outcome', 'weightclass', 'method', 'round', 'time',
    'time_format', 'referee', 'details', 'url', 'fighter1_name', 'fighter2_name', 'fighter1_win'
]
y = full_df["fighter1_win"]
X = full_df.drop(columns=drop_cols, errors="ignore")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

ros = RandomOverSampler(random_state=42)
X_train_res, y_train_res = ros.fit_resample(X_train, y_train)

# Swap fighter1 and fighter2 stats
fighter1_cols = [c for c in X.columns if "_fighter1" in c]
fighter2_cols = [c for c in X.columns if "_fighter2" in c]

X_swapped = X_train_res.copy()
X_swapped[fighter1_cols] = X_train_res[fighter2_cols].values
X_swapped[fighter2_cols] = X_train_res[fighter1_cols].values

for col in diff_cols:
    X_swapped[col] = -X_train_res[col]

y_swapped = 1 - y_train_res

# Final augmented dataset
X_train_aug = pd.concat([X_train_res, X_swapped], ignore_index=True)
y_train_aug = pd.concat([y_train_res, y_swapped], ignore_index=True)


#===========================================================
#Train random forest
#===========================================================
rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train_aug, y_train_aug)

#===========================================================
#Train XGBoost
#===========================================================

xgb_model = XGBClassifier(
    n_estimators=600,
    learning_rate=0.05,
    max_depth=7,
    subsample=0.8,
    colsample_bytree=1.0,
    random_state=42,
    reg_lambda=5,
    n_jobs=-1,
    eval_metric='logloss'
)
xgb_model.fit(X_train_aug, y_train_aug)

#===========================================================
#Train LightGBM
#===========================================================

lgb_model = LGBMClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=7,
    subsample=0.7,
    colsample_bytree=0.8,
    random_state=42,
    reg_lambda=0,
    verbose=-1,
    n_jobs=-1
)
lgb_model.fit(X_train_aug, y_train_aug)

#===========================================================
#Save Models 
#===========================================================

os.makedirs("models", exist_ok=True)
joblib.dump(rf, "models/rf_model.pkl")
joblib.dump(xgb_model, "models/xgb_model.pkl")
joblib.dump(lgb_model, "models/lgb_model.pkl")

print("Finished training models")