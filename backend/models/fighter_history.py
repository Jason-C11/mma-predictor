from pydantic import BaseModel
from typing import Optional

class FighterHistory(BaseModel):
    event: str
    fighter_id: str
    fighter_name: str
    opponent_name: str
    weightclass: str
    method: str
    round_: str
    time: str
    time_format: str
    details: str
    outcome: str
