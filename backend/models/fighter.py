from pydantic import BaseModel
from typing import Optional

#Update with other stats later
class Fighter(BaseModel):
    fighter_id: str
    fighter_name: str
 

