
from pydantic import BaseModel
from typing import Optional

class FighterCareerAvg(BaseModel):
    fighter_id: str
    fighter: str
    sig_str_landed: Optional[float] = None
    total_str_landed: Optional[float] = None
    td_landed: Optional[float] = None
    head_landed: Optional[float] = None
    body_landed: Optional[float] = None
    leg_landed: Optional[float] = None
    distance_landed: Optional[float] = None
    clinch_landed: Optional[float] = None
    ground_landed: Optional[float] = None
    sig_str_attempts: Optional[float] = None
    total_str_attempts: Optional[float] = None
    td_attempts: Optional[float] = None
    kd: Optional[float] = None
    sub_att: Optional[float] = None
    rev: Optional[float] = None
    ctrl_seconds: Optional[float] = None
    sig_str_acc: Optional[float] = None
    td_acc: Optional[float] = None

