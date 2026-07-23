from datetime import datetime, time
from pydantic import BaseModel, ConfigDict

from app.models.rest_hours import Weekday


# 베이스
class HourBase(BaseModel):
    weekday: Weekday
    is_closed: bool
    open_time: time | None = None
    close_time: time | None = None

# 단일/단순 조회용
class HourRead(HourBase):
    created: datetime
    updated: datetime

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 
