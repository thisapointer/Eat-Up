import React, { useState, useEffect } from 'react';

// API 및 UI 컴포넌트 Import
import { getUserInfo } from "../api/mypageApi";
import RestaurantInfoCard from '../components/certmotion/RestaurantInfoCard';
import MenuList from "../components/certmotion/MenuList";
import GradeCard from "../components/certmotion/GradeCard";
import CertConfirmButton from "../components/certmotion/CertConfirmButton";

// 스타일 시트
import '../styles/CertMotionPage.css';

// 더미 이미지 및 상수 데이터
const DUMMY_IMAGE = "https://pub-c42eb03962324e18acec6a26de669798.r2.dev/images/rests/rest2/rest_img.webp";

const TEST_RESTAURANT_DATA = {
  date: '2026-06-05',
  storeName: '닭꼬얌 홍대점',
  category: '한식',
  totalVisitCount: '100번 방문',
};

const DUMMY_MENU_LIST = [
  { id: 1, title: '닭쌈밥 정식', price: '9,000원', count: '12번', imgUrl: DUMMY_IMAGE },
  { id: 2, title: '고추장 바베큐', price: '22,000원', count: '12번', imgUrl: DUMMY_IMAGE },
  { id: 3, title: '닭고기', price: '4,000원', count: '12번', imgUrl: DUMMY_IMAGE },
  { id: 4, title: '사이드 감자튀김', price: '5,000원', count: '5번', imgUrl: DUMMY_IMAGE },
];

function CertMotionPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 마운트 시 유저 정보 로드
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserInfo();
        
        // 유저 정보 전달 및 기본값 설정 (XP 기본값: 500)
        setUserInfo({
          ...userData,
          spoon_xp: userData?.spoon_xp ?? 500,
        });
      } catch (error) {
        console.error("유저 정보를 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 로딩 상태 처리
  if (isLoading) {
    return <div className="page-background"></div>;
  }

  return (
    <div className="page-background">
      <div className="mobile-container">
        {/* 매장 방문 정보 카드 */}
        <RestaurantInfoCard
          date={TEST_RESTAURANT_DATA.date}
          storeName={TEST_RESTAURANT_DATA.storeName}
          category={TEST_RESTAURANT_DATA.category}
          totalVisitCount={TEST_RESTAURANT_DATA.totalVisitCount}
        />

        {/* 주문한 메뉴 목록 */}
        <MenuList menuList={DUMMY_MENU_LIST} />

        {/* 유저 등급 및 XP 카드 */}
        <GradeCard userInfo={userInfo} />

        {/* 인증 확정 버튼 */}
        <CertConfirmButton />
      </div>
    </div>
  );
}

export default CertMotionPage;