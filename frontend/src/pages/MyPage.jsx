import { useEffect, useMemo, useState } from "react";
import {Link} from "react-router-dom";

import Question from "../assets/question.svg";
import StampStepsModal from "../assets/stamp_steps_modal.svg";
import SpoonIcon from "../assets/spoon.svg";
import ForkIcon from "../assets/fork.svg";

/*import NoneStamp from "../assets/nonestamp.svg";
import FirstStamp from "../assets/firststamp.svg";
import AgainStamp from "../assets/againstamp.svg";
import RegularStamp from "../assets/regularstamp.svg";
import JjinStamp from "../assets/jjinstamp.svg";
import EatupStamp from "../assets/eatupstamp.svg";
*/

import { getUserInfo, getVisitedRestCount } from "../api/mypageApi";

import {spoonGradeOptions, getSpoonGradeByGrade} from "../data/spoonGradeData"
import "../styles/MyPage.css";

// API 연동 전까지 화면 확인용으로 쓰는 기본 데이터
// 나중에 백엔드 API가 준비되면 이 객체를 직접 쓰지 않고, API 응답 데이터로 대체하면 됩니다.
const myPageFallbackData = {
  // 맛집 도장 순위에 들어가는 식당 리스트입니다.
  stampRanking: [
    {
      id: "restaurant-1",
      rank: 1,
      name: "닭꼬랑 홍대점",
      category: "한식",
      visitCount: 100,
      stampLabel: "100번 넘은 EATUP",
      phone: "02-322-3331",
      address: "서울 마포구 와우산로 18길 29 지하1층",
    },
  ],
};




// 실제 API가 나오면 이 함수 내부만 교체하면 됩니다.
// 예: return getMyPage(); 또는 return fetch(...).then(...)
async function fetchMyPageData() {
  return myPageFallbackData;
}

// 숫자를 XP 표시 형식으로 바꾸는 작은 유틸 함수입니다.
function formatXp(value) {
  return `${value.toLocaleString()}XP`;
}

function MyPage() {

  const [userInfo, setUserInfo] = useState(null); //api 에서 받은 유저 정보 저장
  const [visitedCount, setVisitedCount] = useState(0); //api 에서 받은 가 본 맛집 갯수 저장
  const [isLoading, setIsLoading] = useState(true); //api 요청중인지 저장
  const [errorMessage, setErrorMessage] = useState(""); //api 실패 메세지 저장
  
  const stampRankData = myPageFallbackData.stampRank;

  // 수저 등급 모달이 열려 있는지 저장합니다.
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  // 수저 등급 팝업에서 현재 보고 있는 등급의 위치 -> api 로 유저 등급 받은 후 현재 위치로 이동
  const [selectedGradeIndex, setSelectedGradeIndex] = useState(0);

  //맛집 도장 순위 모달
  const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);

  // 컴포넌트가 처음 화면에 뜰 때 마이페이지 데이터 가져옴 (API 호출)
  useEffect(() => {
    const fetchMyPageData = async() => {
      try {
 
        const [userData, visitedCountData] = await Promise.all([
          getUserInfo(),
          getVisitedRestCount(),
        ]);
        
        setUserInfo(userData);
        setVisitedCount(visitedCountData);

        //유저 수저 등급에 맞는 팝업 위치 찾음
        const currentGradeIndex = spoonGradeOptions.findIndex(
          (option) => option.grade === Number(userData.spoon_grade)
        );

        //등급 찾았을 때만 팝업 위치 변겯
        if (currentGradeIndex !== -1) {
          setSelectedGradeIndex(currentGradeIndex);
          console.log("나의 등급", currentGradeIndex);
      }

      } catch (error) {
        console.error("마이페이지 API 조회 실패", error);
        setErrorMessage("마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPageData();

  }, []);

  const stampRanking = Array.isArray(myPageFallbackData.stampRanking)
    ? myPageFallbackData.stampRanking
    : [];

  const profile = {
    nickname: userInfo?.nickname ?? "닉네임",
    userId: userInfo?.user_id ?? "",
    profileImage: userInfo?.profile_img ?? "",
    visitedRestaurantCount: visitedCount,
  };

  const currentSpoonGrade = getSpoonGradeByGrade(userInfo?.spoon_grade);

  const spoonGrade = {
    grade: currentSpoonGrade.grade,
    name: currentSpoonGrade.name,
    image: currentSpoonGrade.image,
    level: currentSpoonGrade.level ?? 1,
    currentXp: userInfo?.spoon_xp ?? 0,
    minXp: currentSpoonGrade.minXp,
    nextLevelXp: currentSpoonGrade.maxXp,
  };


  // 현재 팝업에서 보여줄 수저 등급 데이터입니다.
  const selectedGrade = spoonGradeOptions[selectedGradeIndex] ?? {
    levels: [],
  };

  const selectedGradeLevels = Array.isArray(selectedGrade.levels)
    ? selectedGrade.levels
    : [];


  // XP 진행률을 계산
  const progressPercent = useMemo(() => {
    const total = spoonGrade.nextLevelXp - spoonGrade.minXp;
    const current = spoonGrade.currentXp - spoonGrade.minXp;

    if (total <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (current / total) * 100));
  }, [spoonGrade.currentXp, spoonGrade.minXp, spoonGrade.nextLevelXp]);


  // 왼쪽 화살표를 누르면 이전 등급으로 이동합니다.
  const handlePrevGrade = () => {
    setSelectedGradeIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  // 오른쪽 화살표를 누르면 다음 등급으로 이동합니다.
  const handleNextGrade = () => {
    setSelectedGradeIndex((prevIndex) =>
      Math.min(spoonGradeOptions.length - 1, prevIndex + 1)
    );
  };


  if (isLoading) {
    return <main className="mypage">불러오는 중...</main>;
  }

  if (errorMessage) {
    return <main className="mypage">{errorMessage}</main>;
  }

  return (
    <main className="mypage">
      {/* 페이지 제목 영역입니다. */}
      <header className="mypage-header">
        <h1>마이페이지</h1>
      </header>

      {/* 상단 프로필 요약 카드입니다. */}
      <Link className="mypage-profile-card" to="/mypage/profile" aria-label="내 프로필 요약 및 프로필 수정 페이지로 이동">
        <div className="mypage-avatar">
          {profile.profileImage ? (
            <img src={profile.profileImageUrl} alt={`${profile.nickname} 프로필`} />
          ) : (
            <span aria-hidden="true" />
          )}
        </div>

        <div className="mypage-profile-name">
          <strong>{profile.nickname}</strong>
          <span>{profile.userId}</span>
        </div>

        <div className="mypage-visited-summary" aria-label="가 본 맛집 수">
        <img className="mypage-cutlery-icon" src={SpoonIcon} alt="" aria-hidden="true" />

        <div className="mypage-visited-text">
          <span>가 본 맛집</span>
          <strong>{profile.visitedRestaurantCount}</strong>
        </div>

        <img className="mypage-cutlery-icon" src={ForkIcon} alt="" aria-hidden="true" />
      </div>
      </Link>

      {/* 수저 등급 카드 영역입니다. */}
      <section className="mypage-section" aria-labelledby="spoon-grade-title">
        <h2 id="spoon-grade-title">나의 수저 등급</h2>

        {/* 이 카드를 클릭하면 수저 등급 모달이 열립니다. */}
        <button
          className="mypage-grade-card"
          type="button"
          onClick={() => {
            setIsGradeModalOpen(true);
          }}
        >
          <div className="mypage-grade-visual">
            <img
              className="mypage-spoon-image"
              src={spoonGrade.image}
              alt={spoonGrade.name}
            />
          </div>

          <strong>
            {spoonGrade.name} {spoonGrade.level}호
          </strong>

          <div className="mypage-progress" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>

          <p>
            현재 {formatXp(spoonGrade.currentXp)}
            <br />
            레벨업까지 {formatXp(spoonGrade.nextLevelXp - spoonGrade.currentXp)}
          </p>
        </button>
      </section>

      {/* 맛집 도장 순위 영역입니다. */}
      <section className="mypage-section" aria-labelledby="stamp-ranking-title">
        <h2 id="stamp-ranking-title" className="mypage-ranking-title">
          맛집 도장 순위
          <button className="mypage-question-button" type="button" onClick={() => setIsMedalModalOpen(true)} aria-label="도장 순위 안내 열기" >
            <img src={Question} alt="" aria-hidden="true" />
          </button>
        </h2>

        <div className="mypage-ranking-list">
          {stampRanking.map((restaurant) => (
            <article className="mypage-ranking-card" key={restaurant.id}>
              <div>
                <strong>
                  {restaurant.name} <span>{restaurant.category}</span>
                </strong>
                <p>
                  영업 중 {restaurant.visitCount}:00 까지
                  <button type="button" aria-label="영업시간 더보기">
                    ˅
                  </button>
                </p>
                <p>☎ {restaurant.phone}</p>
                <p>⌖ {restaurant.address}</p>
              </div>

              <div className="mypage-stamp-badge">
                <span>{restaurant.stampLabel}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 수저 등급 모달입니다. isGradeModalOpen이 true일 때만 화면에 나타납니다. */}
      {isGradeModalOpen && (
        <div
          className="mypage-modal-backdrop"
          role="presentation"
          onClick={() => setIsGradeModalOpen(false)}
        >
          {/* 모달 카드와 좌우 화살표를 같이 감싸는 영역입니다. */}
          <div
            className="mypage-grade-modal-shell"
            onClick={(event) => event.stopPropagation()}
          >
            {/* 이전 등급 보기 버튼입니다. */}
            <button
              className="mypage-grade-nav mypage-grade-nav--prev"
              type="button"
              aria-label="이전 수저 등급 보기"
              onClick={handlePrevGrade}
              disabled={selectedGradeIndex === 0}
            >
              ‹
            </button>

            <section
              className="mypage-grade-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="grade-modal-title"
            >
              <button
                className="mypage-modal-close"
                type="button"
                aria-label="닫기"
                onClick={() => setIsGradeModalOpen(false)}
              >
                ×
              </button>

              <div className="mypage-modal-heading">
                <img
                  className="mypage-modal-spoon-image"
                  src={selectedGrade.image}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <h2 id="grade-modal-title">{selectedGrade.name}</h2>
                  <p>
                    {formatXp(selectedGrade.minXp)} ~ {formatXp(selectedGrade.maxXp)}
                  </p>
                  <p>{selectedGrade.description}</p>
                </div>
              </div>

              <ol className="mypage-grade-levels">
                {selectedGradeLevels.map((level) => {
                  const isAchieved = spoonGrade.currentXp >= level.minXp;
                  return (
                    <li
                      className={isAchieved ? "mypage-grade-level--achieved" : ""}
                      key={level.level}
                    >
                      {/* achieved가 true인 등급에만 체크가 표시됩니다. */}
                      <span>{isAchieved ? "✓" : ""}</span>
                      <strong>{level.level}호</strong>
                      <p>
                        {formatXp(level.minXp)} ~ {formatXp(level.maxXp)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* 다음 등급 보기 버튼입니다. */}
            <button
              className="mypage-grade-nav mypage-grade-nav--next"
              type="button"
              aria-label="다음 수저 등급 보기"
              onClick={handleNextGrade}
              disabled={selectedGradeIndex === spoonGradeOptions.length - 1}
            >
              ›
            </button>
          </div>
        </div>
      )}


      {/* 도장 기준 모달입니다. isMedalModalOpen이 true일 때만 화면에 나타납니다. */}
      {isMedalModalOpen && (
        <div
          className="mypage-modal-backdrop"
          role="presentation"
          onClick={() => setIsMedalModalOpen(false)}
        >
          {/* 
            도장 기준은 JSX로 다시 만들지 않고 SVG 이미지를 통째로 띄웁니다.
            그래서 수저 등급 모달 CSS와 섞이지 않습니다.
          */}
          <section
            className="mypage-stamp-image-modal"
            role="dialog"
            aria-modal="true"
            aria-label="맛집 도장 기준"
            onClick={(event) => event.stopPropagation()}
          >
            {/* 팝업 닫기 버튼입니다. */}
            <button
              className="mypage-modal-close"
              type="button"
              aria-label="닫기"
              onClick={() => setIsMedalModalOpen(false)}
            >
              ×
            </button>

            {/* 피그마에서 저장한 도장 기준 SVG 이미지입니다. */}
            <img
              className="mypage-stamp-modal-image"
              src={StampStepsModal}
              alt="맛집 도장 기준"
            />
          </section>
        </div>
      )}


    </main>
  );
}

export default MyPage;
