from pydantic import BaseModel
from typing import Optional

class FightResult(BaseModel):
    event: str
    bout: str
    outcome: str
    weightclass: str
    method: str
    round: int
    time: str
    time_format: str
    referee: Optional[str] = None
    details: Optional[str] = None
    url: str