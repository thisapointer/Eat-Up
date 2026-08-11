import { useEffect, useMemo, useState } from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";

import Question from "../assets/question.svg";
import StampStepsModal from "../assets/stamp_steps_modal.svg";
import StampStepModalOpen from "../assets/stamp_steps_modal_open.svg";
import SpoonIcon from "../assets/spoon.svg";
import ForkIcon from "../assets/fork.svg";
import CallIcon from "../assets/call.svg";
import LocationIcon from "../assets/location.svg";

import { getUserInfo, getVisitedRestCount, getRestList } from "../api/mypageApi";
import { createRestaurantLike, deleteRestaurantLike } from "../api/likeApi";

import {spoonGradeOptions, getSpoonGradeByXp, getSpoonGradeIndexByXp} from "../data/spoonGradeData"
import RestaurantStampBadge from "../components/restaurant/RestaurantStampBadge";
import MapRestaurantSheet from "../components/map/MapRestaurantSheet";
import "../styles/MyPage.css";


// 숫자를 XP 표시 형식으로 바꾸는 작은 유틸 함수
function formatXp(value) {
  return `${value.toLocaleString()}XP`;
}

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userInfo, setUserInfo] = useState(null); //api 에서 받은 유저 정보 저장
  const [visitedCount, setVisitedCount] = useState(0); //api 에서 받은 가 본 맛집 갯수 저장
  const [isLoading, setIsLoading] = useState(true); //api 요청중인지 저장
  const [errorMessage, setErrorMessage] = useState(""); //api 실패 메세지 저장
  const [restList, setRestList] = useState([]);
  const [sheetRestaurant, setSheetRestaurant] = useState(null);
  const [sheetMode, setSheetMode] = useState("closed");
  
  const currentXp = userInfo?.spoon_xp ?? 0;

  const currentSpoonGradeIndex = getSpoonGradeIndexByXp(currentXp);

  const currentSpoonGrade = getSpoonGradeByXp(currentXp);

  const spoonGrade = {
    grade: currentSpoonGrade.grade,
    level: currentSpoonGrade.level,
    name: currentSpoonGrade.name,
    image: currentSpoonGrade.image,
    imagespin: currentSpoonGrade.imagespin,
    currentXp,
    minXp: currentSpoonGrade.minXp,
    nextLevelXp: currentSpoonGrade.maxXp,
  };

  const handleOpenGradeModal = () => {
    setSelectedGradeIndex(currentSpoonGradeIndex);
    setIsGradeModalOpen(true);
  };

  const handleRankingCardClick = (restaurant) => {
    const restInfo = restaurant.restInfo ?? restaurant;

    setSheetRestaurant({
      ...restInfo,
      visitCount:
        restaurant.visitCount ??
        restaurant.visit_count ??
        0,
      visit_count:
        restaurant.visitCount ??
        restaurant.visit_count ??
        0,
      isLiked:
        restaurant.isLiked ??
        restaurant.is_liked ??
        restInfo.isLiked ??
        restInfo.is_liked ??
        false,
    });

    setSheetMode("expanded");
  };

  const handleSheetLikeToggle = async () => {
    if (!sheetRestaurant) {
      return;
    }

    const restId = sheetRestaurant.id;
    const currentIsLiked =
      sheetRestaurant.isLiked ??
      sheetRestaurant.is_liked ??
      false;

    const nextIsLiked = !currentIsLiked;

    setSheetRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      isLiked: nextIsLiked,
      is_liked: nextIsLiked,
    }));

    try {
      if (nextIsLiked) {
        await createRestaurantLike(restId);
      } else {
        await deleteRestaurantLike(restId);
      }
    } catch (error) {
      console.error("찜 상태 변경 실패:", error);

      setSheetRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        isLiked: currentIsLiked,
        is_liked: currentIsLiked,
      }));
    }
  };

  // 수저 등급 모달이 열려 있는지 저장
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  // 수저 등급 팝업에서 현재 보고 있는 등급의 위치 -> api 로 유저 등급 받은 후 현재 위치로 이동
  const [selectedGradeIndex, setSelectedGradeIndex] = useState(0);

  //맛집 도장 순위 모달
  const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);

  useEffect(() => {
    const returnedRestaurant = location.state?.selectedRestaurant;

    if (
      !returnedRestaurant ||
      location.state?.sheetMode !== "expanded"
    ) {
      return;
    }

    setSheetRestaurant(returnedRestaurant);
    setSheetMode("expanded");

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.state, location.pathname, navigate]);

  // 컴포넌트가 처음 화면에 뜰 때 마이페이지 데이터 가져옴 (API 호출)
  useEffect(() => {
    const fetchMyPageData = async() => {
      try {
 
        const [userData, visitedCountData, restListData] = await Promise.all([
          getUserInfo(),
          getVisitedRestCount(),
          getRestList(),
        ]);
        
        setUserInfo(userData);
        setVisitedCount(visitedCountData);
        setRestList(Array.isArray(restListData) ? restListData : []);

        //유저 수저 등급에 맞는 팝업 위치 찾음
        const currentGradeIndex = getSpoonGradeIndexByXp(userData.spoon_xp ?? 0);
        setSelectedGradeIndex(currentGradeIndex);

        //등급 찾았을 때만 팝업 위치 변겯
        if (currentGradeIndex !== -1) {
          setSelectedGradeIndex(currentGradeIndex);
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

  const profile = {
    nickname: userInfo?.nickname ?? "닉네임",
    userId: userInfo?.user_id ?? "",
    profileImage: userInfo?.profile_img ?? "",
    visitedRestaurantCount: visitedCount,
  };


  const visibleRestList = restList.slice(0,2);

  // 한 식당을 100회 이상 방문했는지 확인합니다.
  const hasEatUpStamp = restList.some((restaurant) => {
    const visitCount =
      restaurant.visitCount ??
      restaurant.visit_count ??
      0;

    return Number(visitCount) >= 100;
  });

  // 100회 이상 도장을 달성하면 열린 모달 이미지를 사용
  const stampModalImage = hasEatUpStamp
    ? StampStepModalOpen
    : StampStepsModal;


  // 현재 팝업에서 보여줄 수저 등급 데이터
  const selectedGrade = spoonGradeOptions[selectedGradeIndex] ?? {
    levels: [],
  };

  const isCurrentSpoonGrade = selectedGradeIndex === currentSpoonGradeIndex;

  const selectedGradeLevels = Array.isArray(selectedGrade.levels)
    ? selectedGrade.levels
    : [];


  // XP 진행률을 계산
  const progressPercent = useMemo(() => {
    const total = spoonGrade.nextLevelXp - spoonGrade.minXp;
    const current = spoonGrade.currentXp - spoonGrade.minXp;

    if (total <= 0) {
      return 100;
    }

    return Math.min(100, Math.max(0, (current / total) * 100));
  }, [spoonGrade]);


  // 왼쪽 화살표 - 이전 등급으로 이동
  const handlePrevGrade = () => {
    setSelectedGradeIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  // 오른쪽 화살표 - 다음 등급으로 이동
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
          onClick={handleOpenGradeModal}
        >
          <div className="mypage-grade-visual">
            <img
              className="mypage-spoon-image"
              src={spoonGrade.imagespin}
              alt={spoonGrade.name}
            />
          </div>

          <strong>
            {spoonGrade.name} {spoonGrade.level}
          </strong>

          <div className="mypage-progress" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>

          <p>
            현재 {formatXp(spoonGrade.currentXp)}
            <br />
            레벨업까지 {Math.max(0, spoonGrade.nextLevelXp - spoonGrade.currentXp).toLocaleString()}XP
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
          {visibleRestList.length > 0 ? (
            <>
              {visibleRestList.map((restaurant) => (
                <article 
                  className="mypage-ranking-card" 
                  key={restaurant.id} 
                  onClick={() => handleRankingCardClick(restaurant)}
                >
                  <div>
                    <strong>
                      {restaurant.name} <span>{restaurant.category}</span>
                    </strong>

                    <p>{restaurant.info}</p>

                    {restaurant.phone && (
                      <p className="restaurant-info-row">
                        <img src={CallIcon} alt="" aria-hidden="true" />
                        <span>{restaurant.phone}</span>
                      </p>
                    )}

                    {restaurant.address && (
                      <p className="restaurant-info-row">
                        <img src={LocationIcon} alt="" aria-hidden="true" />
                        <span>{restaurant.address}</span>
                      </p>
                    )}
                  </div>

                  <RestaurantStampBadge visitCount={restaurant.visitCount} />
                </article>
              ))}
              
              <button
                className="mypage-stamp-more-button"
                type="button"
                onClick={() => navigate("/mypage/records")}
              > 
                모두 보기
              </button>
            </>
          ) : (
            <p className="mypage-stamp-empty">아직 가 본 맛집이 없습니다 시도해보세요!</p>
          )}
        </div>
      </section>

      {sheetRestaurant && sheetMode !== "closed" && (
        <MapRestaurantSheet
          restaurant={sheetRestaurant}
          sheetMode={sheetMode}
          onSheetModeChange={setSheetMode}
          onLikeToggle={handleSheetLikeToggle}
          showBackButton
          onClose={() => {setSheetRestaurant(null); setSheetMode("closed");}}
        />
      )}

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
              className= {
                `mypage-grade-modal ${
                  isCurrentSpoonGrade 
                    ? "mypage-grade-modal--current"
                    : ""
                }`
              }
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
                      <strong>{level.level}</strong>
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
