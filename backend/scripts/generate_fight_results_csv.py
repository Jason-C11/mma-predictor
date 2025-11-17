import pandas as pd
import os

def strip_columns(df):
    for col in df.columns:
        df[col] = df[col].apply(lambda x: x.strip() if isinstance(x, str) else x)
    return df

# Load CSV
data_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fight_results.csv")
bouts_df = pd.read_csv(data_path)

bouts_df = strip_columns(bouts_df)

fighter_rows = []

for _, row in bouts_df.iterrows():
    event = row["EVENT"]
    bout = row["BOUT"]
    outcome = row["OUTCOME"]
    weightclass = row["WEIGHTCLASS"]
    method = row["METHOD"]
    round_ = row["ROUND"]
    time = row["TIME"]
    time_format = row["TIME FORMAT"]
    details = row.get("DETAILS", "")

    # Get fighter names
    try:
        fighter1_name, fighter2_name = [x.strip() for x in bout.split("vs.")]
    except ValueError:
        print(f"Skipping invalid bout format: {bout}")
        continue
    
    #Parse outcomes
    if outcome == "W/L":
        fighter1_outcome = "Win"
        fighter2_outcome = "Loss"
    elif outcome == "L/W":
        fighter1_outcome = "Loss"
        fighter2_outcome = "Win"
    elif outcome == "D/D":
        fighter1_outcome = "Draw"
        fighter2_outcome = "Draw"
    elif outcome == "NC/NC":
        fighter1_outcome = "No Contest"
        fighter2_outcome = "No Contest"
    else:
        fighter1_outcome = outcome
        fighter2_outcome = outcome

    # Fighter1 row
    fighter_rows.append({
        "event": event.strip() if isinstance(event, str) else event,
        "fighter_name": fighter1_name,
        "opponent_name": fighter2_name,
        "weightclass": weightclass.strip() if isinstance(weightclass, str) else weightclass,
        "method": method.strip() if isinstance(method, str) else method,
        "round": round_,
        "time": time.strip() if isinstance(time, str) else time,
        "time_format": time_format.strip() if isinstance(time_format, str) else time_format,
        "details": details.strip() if isinstance(details, str) else details,
        "outcome": fighter1_outcome
    })
    # Fighter2 row
    fighter_rows.append({
        "event": event.strip() if isinstance(event, str) else event,
        "fighter_name": fighter2_name,
        "opponent_name": fighter1_name,
        "weightclass": weightclass.strip() if isinstance(weightclass, str) else weightclass,
        "method": method.strip() if isinstance(method, str) else method,
        "round": round_,
        "time": time.strip() if isinstance(time, str) else time,
        "time_format": time_format.strip() if isinstance(time_format, str) else time_format,
        "details": details.strip() if isinstance(details, str) else details,
        "outcome": fighter2_outcome
    })

fighter_history = pd.DataFrame(fighter_rows)

# Clean extra spacing
fighter_history = strip_columns(fighter_history)

# Export to CSV
save_path = os.path.join(os.path.dirname(__file__), "../../data/ufc_fighter_history.csv")
fighter_history.to_csv(save_path, index=False)
print("Successfully exported to csv")
