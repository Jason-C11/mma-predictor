import numpy as np
import pandas as pd
import os

#===========================================================
# Load data
#===========================================================

rounds_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fight_stats.csv")
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

rounds_df.columns = rounds_df.columns.str.strip().str.lower().str.replace(" ", "_")

#===========================================================
#Parse stats at round level
#===========================================================

cols_to_parse = ["sig.str.", "total_str.", "td", "head", "body", "leg", "distance", "clinch", "ground"]

for col in cols_to_parse:
    if col in rounds_df.columns:
        rounds_df[[f"{col}_landed", f"{col}_attempts"]] = rounds_df[col].apply(
            lambda x: pd.Series(parse_attempts(x))
        )

# Parse percentages and control time
rounds_df = rounds_df.assign(
    **{col: rounds_df[col].apply(parse_percent) for col in rounds_df.columns if "%" in col}
)
if "ctrl" in rounds_df.columns:
    rounds_df["ctrl_seconds"] = rounds_df["ctrl"].apply(time_to_seconds)

# Ensure numeric columns
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
    rounds_df.groupby(["event", "bout", "fighter"], as_index=False)[agg_cols].sum()
)

# Compute accuracy metrics
fighter_stats["sig_str_acc"] = (
    fighter_stats["sig.str._landed"] / fighter_stats["sig.str._attempts"].replace(0, np.nan)
)
fighter_stats["td_acc"] = (
    fighter_stats["td_landed"] / fighter_stats["td_attempts"].replace(0, np.nan)
)

# Clean fighter and event text fields
for col in ["event", "bout"]:
    fighter_stats[col] = fighter_stats[col].apply(clean_text)

#===========================================================
#Compute career averages per fighter
#===========================================================

career_avg_df = fighter_stats.groupby("fighter").mean(numeric_only=True).reset_index()

# int_cols = [
#     'kd', 'sub.att', 'rev.', 'ctrl_seconds', 'sig.str._landed', 
#     'total_str._landed', 'td_landed', 'head_landed', 'body_landed',
#     'leg_landed', 'distance_landed', 'clinch_landed', 'ground_landed',
#     'sig.str._attempts', 'total_str._attempts', 'td_attempts'
# ]
# # career_avg_df[int_cols] = career_avg_df[int_cols].round()

#Check if any of the accuracy columns are NaN --> set to 0
#May need to change if model changes
career_avg_df["td_acc"].fillna(0, inplace=True)
career_avg_df["sig_str_acc"].fillna(0, inplace=True)
#===========================================================
#Final cleanup of column names
#===========================================================

career_avg_df.columns = (
    career_avg_df.columns
    .str.replace(".","_", regex=False)
    .str.replace("__","_", regex=False)
    .str.rstrip("_")
)

#===========================================================
#Export to csv
#===========================================================
save_path = os.path.join(os.path.dirname(__file__), "../../data/career_avg_stats.csv")
career_avg_df.to_csv(save_path, index=False)
print("Successfully exported to csv")