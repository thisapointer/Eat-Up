from typing import Literal
from datetime import datetime
from pydantic import BaseModel, ConfigDict, computed_field


# 수저 등급과 단계의 XP 기준선
GRADE_RANK_RULES = [
    {
        "grade_name": "일회용 수저",
        "max_exp": 1000,
        "rank_thresholds": [1000]
    },
    {
        "grade_name": "스테인리스 수저",
        "max_exp": 7000,
        "rank_thresholds": [2500, 4500, 7000]
    },
    {
        "grade_name": "은수저",
        "max_exp": 26000,
        "rank_thresholds": [10500, 15000, 20000, 26000]
    },
    {
        "grade_name": "금수저",
        "max_exp": 86000,
        "rank_thresholds": [34000, 44000, 56000, 70000, 86000]
    },
    {
        "grade_name": "다이아 수저",
        "max_exp": 236000,
        "rank_thresholds": [106000, 131000, 161000, 196000, 236000]
    },
    {
        "grade_name": "오마카세 수저",
        "max_exp": 596000,
        "rank_thresholds": [286000, 346000, 416000, 496000, 2596000]
    },
    {
        "grade_name": "Eat Up 수저",
        "max_exp": 16777215,
        "rank_thresholds": None
    }
]


# 베이스
class UserBase(BaseModel):
    user_id: str        # 유저 아이디
    nickname: str       # 별명
    provider: Literal["local", "kakao"] = "local"     # 로그인 방식

# 생성용
class UserCreate(UserBase):
    password: str       # 비밀번호

# 수정용
class UserUpdate(BaseModel):
    nickname: str | None = None
    password: str | None = None

# 단일/단순 조회용
class UserRead(UserBase):

    profile_img: str | None = ""        # 프로필 사진 경로
    spoon_xp: int       # 수저 경험치

    @computed_field
    def spoon_grade(self) -> str:   # 수저 등급

        grade_tier = "일회용 수저"
        grade_rank = 1

        for rule in GRADE_RANK_RULES:
            if self.spoon_xp <= rule["max_exp"]:

                # 등급 결정
                grade_tier = rule["grade_name"]

                # 최고 수저 등급인 경우
                if grade_tier == "Eat Up 수저":
                        return f"{grade_tier} 최고등급"
                
                # 단계별 상한선으로 단계 결정
                for index, cut_score in enumerate(rule["rank_thresholds"]):
                    if self.spoon_xp <= cut_score:
                        grade_rank = index + 1
                        break

                break
        
        return f"{grade_tier} {grade_rank}단계"

    id: int
    created: datetime
    updated: datetime

    # ORM 객체(Model)를 Pydantic으로 변환 허용
    model_config = ConfigDict(from_attributes=True) 

# 다중 조회용
class UserListResponse(BaseModel):
    total_count: int        # 전체 데이터 개수 (프론트엔드 페이지네이션 바 구현용)
    users: list[UserRead]   # 실제 유저 목록 데이터

# 덮어쓰기용
class UserReplace(UserCreate):
    pass