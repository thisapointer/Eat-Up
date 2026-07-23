import { useEffect, useMemo, useState } from "react";
import "../styles/MyPage.css";
import {Link} from "react-router-dom";
import Question from "../assets/question.svg";
import StampStepsModal from "../assets/stamp_steps_modal.svg";
/*import NoneStamp from "../assets/nonestamp.svg";
import FirstStamp from "../assets/firststamp.svg";
import AgainStamp from "../assets/againstamp.svg";
import RegularStamp from "../assets/regularstamp.svg";
import JjinStamp from "../assets/jjinstamp.svg";
import EatupStamp from "../assets/eatupstamp.svg";
*/
import SpoonIcon from "../assets/spoon.svg";
import ForkIcon from "../assets/fork.svg";




// API 연동 전까지 화면 확인용으로 쓰는 기본 데이터
// 나중에 백엔드 API가 준비되면 이 객체를 직접 쓰지 않고, API 응답 데이터로 대체하면 됩니다.
const myPageFallbackData = {
  // 프로필 카드에 들어가는 사용자 기본 정보입니다.
  profile: {
    nickname: "이서준",
    userId: "sin390is0.5",
    visitedRestaurantCount: 234,
    profileImageUrl: "",
  },

  // 수저 등급 카드와 수저 등급 모달에 들어가는 정보입니다.
  spoonGrade: {
    name: "금수저",
    level: 2,
    currentXp: 7800,
    nextLevelXp: 8200,
    minXp: 7000,
    maxXp: 9000,
    description: "당신은 진정한 식객에 입문했습니다.",
    imageUrl: "",

    // 모달에서 1호, 2호, 3호처럼 단계별 XP 범위를 보여줄 때 사용합니다.
    levels: [
      { level: 1, minXp: 7000, maxXp: 7400, achieved: true },
      { level: 2, minXp: 7400, maxXp: 7800, achieved: true },
      { level: 3, minXp: 7800, maxXp: 8200, achieved: false },
      { level: 4, minXp: 8200, maxXp: 8600, achieved: false },
      { level: 5, minXp: 8600, maxXp: 9000, achieved: false },
    ],
  },

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

// 수저 등급 팝업에서 좌우 화살표로 넘겨 볼 등급 목록입니다.
// 나중에 백엔드에서 등급 목록을 받으면 이 배열만 API 응답으로 바꾸면 됩니다.
const spoonGradeOptions = [
  {
    id: "silver",
    name: "은수저",
    minXp: 3000,
    maxXp: 7000,
    description: "당신은 진정한 식객에 입문했습니다.",
    levels: [
      { level: 1, minXp: 3000, maxXp: 3800, achieved: true },
      { level: 2, minXp: 3800, maxXp: 4600, achieved: true },
      { level: 3, minXp: 4600, maxXp: 5400, achieved: true },
      { level: 4, minXp: 5400, maxXp: 6200, achieved: true },
      { level: 5, minXp: 6200, maxXp: 7000, achieved: true },
    ],
  },
  {
    id: "gold",
    name: "금수저",
    minXp: 7000,
    maxXp: 9000,
    description: "당신은 진정한 식객에 입문했습니다.",
    levels: [
      { level: 1, minXp: 7000, maxXp: 7400, achieved: true },
      { level: 2, minXp: 7400, maxXp: 7800, achieved: false },
      { level: 3, minXp: 7800, maxXp: 8200, achieved: false },
      { level: 4, minXp: 8200, maxXp: 8600, achieved: false },
      { level: 5, minXp: 8600, maxXp: 9000, achieved: false },
    ],
  },
  {
    id: "diamond",
    name: "다음 등급",
    minXp: 9000,
    maxXp: 12000,
    description: "다음 수저 등급입니다.",
    levels: [
      { level: 1, minXp: 9000, maxXp: 9600, achieved: false },
      { level: 2, minXp: 9600, maxXp: 10200, achieved: false },
      { level: 3, minXp: 10200, maxXp: 10800, achieved: false },
      { level: 4, minXp: 10800, maxXp: 11400, achieved: false },
      { level: 5, minXp: 11400, maxXp: 12000, achieved: false },
    ],
  },
];

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
  // 마이페이지 전체 데이터를 state로 관리합니다.
  // 처음에는 fallback 데이터를 보여주고, 이후 API 응답으로 교체할 수 있습니다.
  const [myPageData, setMyPageData] = useState(myPageFallbackData);

  // 수저 등급 모달이 열려 있는지 저장합니다.
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  // 수저 등급 팝업에서 현재 보고 있는 등급의 위치입니다.
  // 1은 spoonGradeOptions 배열의 두 번째 값, 즉 금수저를 처음 보여준다는 뜻입니다.
  const [selectedGradeIndex, setSelectedGradeIndex] = useState(1);

  //맛집 도장 순위 모달
  const [isMedalModalOpen, setIsMedalModalOpen] = useState(false);

  // 컴포넌트가 처음 화면에 뜰 때 마이페이지 데이터를 불러옵니다.
  useEffect(() => {
    // 화면이 사라진 뒤 setState가 실행되는 것을 막기 위한 안전장치입니다.
    let isMounted = true;

    fetchMyPageData().then((data) => {
      if (isMounted) {
        setMyPageData(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // JSX에서 쓰기 편하게 데이터 객체를 분해합니다.
  const { profile, spoonGrade, stampRanking } = myPageData;

  // XP 진행률을 계산합니다.
  // currentXp가 minXp와 nextLevelXp 사이에서 몇 퍼센트인지 계산해 progress bar width에 씁니다.
  const progressPercent = useMemo(() => {
    const total = spoonGrade.nextLevelXp - spoonGrade.minXp;
    const current = spoonGrade.currentXp - spoonGrade.minXp;

    if (total <= 0) {
      return 0;
    }

    return Math.min(100, Math.max(0, (current / total) * 100));
  }, [spoonGrade]);

  // 현재 팝업에서 보여줄 수저 등급 데이터입니다.
  const selectedGrade = spoonGradeOptions[selectedGradeIndex];

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

  return (
    <main className="mypage">
      {/* 페이지 제목 영역입니다. */}
      <header className="mypage-header">
        <h1>마이페이지</h1>
      </header>

      {/* 상단 프로필 요약 카드입니다. */}
      <Link className="mypage-profile-card" to="/mypage/profile" aria-label="내 프로필 요약 및 프로필 수정 페이지로 이동">
        <div className="mypage-avatar">
          {profile.profileImageUrl ? (
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
            setSelectedGradeIndex(1); // 팝업을 열 때 금수저부터 보이게 합니다.
            setIsGradeModalOpen(true);
          }}
        >
          <div className="mypage-grade-visual">
            {spoonGrade.imageUrl ? (
              <img src={spoonGrade.imageUrl} alt="" />
            ) : (
              <span className="mypage-spoon-illustration" aria-hidden="true" />
            )}
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
                <span className="mypage-spoon-illustration" aria-hidden="true" />
                <div>
                  <h2 id="grade-modal-title">{selectedGrade.name}</h2>
                  <p>
                    {formatXp(selectedGrade.minXp)} ~ {formatXp(selectedGrade.maxXp)}
                  </p>
                  <p>{selectedGrade.description}</p>
                </div>
              </div>

              <ol className="mypage-grade-levels">
                {selectedGrade.levels.map((level) => (
                  <li
                    className={level.achieved ? "mypage-grade-level--achieved" : ""}
                    key={level.level}
                  >
                    {/* achieved가 true인 등급에만 체크가 표시됩니다. */}
                    <span>{level.achieved ? "✓" : ""}</span>
                    <strong>{level.level}호</strong>
                    <p>
                      {formatXp(level.minXp)} ~ {formatXp(level.maxXp)}
                    </p>
                  </li>
                ))}
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
