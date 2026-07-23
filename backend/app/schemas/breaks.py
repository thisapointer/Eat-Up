from datetime import datetime, time
from pydantic import BaseModel, ConfigDict


# 베이스
class BreakBase(BaseModel):
    break_start_time: time
    break_start_time: time
    break_id: int | None = None

# 단일/단순 조회용
class BreakRead(BreakBase):
    created: datetime
    updated: datetime

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 
