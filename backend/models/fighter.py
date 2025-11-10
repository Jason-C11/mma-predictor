from pydantic import BaseModel
from typing import Optional

#Update with other stats later
class Fighter(BaseModel):
    fighter_id: str
    fighter_name: str
    height: Optional[str] = None
    weight: Optional[str] = None
    reach: Optional[str] = None
    stance: Optional[str] = None
    dob: Optional[str] = None


