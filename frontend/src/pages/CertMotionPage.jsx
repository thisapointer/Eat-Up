import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

// API 및 UI 컴포넌트 Import
import { getUserInfo } from "../api/mypageApi";
import RestaurantInfoCard from '../components/certmotion/RestaurantInfoCard';
import MenuList from "../components/certmotion/MenuList";
import GradeCard from "../components/certmotion/GradeCard";
import CertConfirmButton from "../components/certmotion/CertConfirmButton";
import { getRestaurantMyRecord } from '../api/certApi';

// 스타일 시트
import '../styles/CertMotionPage.css';


function formatPrice(price) {
  return `${Number(price ?? 0).toLocaleString()}원`;
}


function CertMotionPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuCountMap, setMenuCountMap] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const restaurant = location.state?.restaurant;
  const selectedMenus = location.state?.selectedMenus ?? [];
  const certDate = location.state?.certDate ?? "";
  const returnTo = location.state?.returnTo ?? "/map";

  const visitCount = (restaurant?.visitCount ?? restaurant?.visit_count ?? 0) + 1;
  const menuList = useMemo(
    () => 
      selectedMenus.map((menu) => ({
        id: menu.id,
        title: menu.name,
        price: formatPrice(menu.price),
        count: `${menuCountMap[menu.id] ?? 0}번`,
        imgUrl: menu.img ?? menu.image ?? "",
      })),
    [selectedMenus, menuCountMap]
  );

  useEffect(() => {
    if (!restaurant?.id) {
      navigate("/map", { replace: true });
      return;
    }

    const fetchMotionData = async () => {
      try {
        setIsLoading(true);

        const [userData, recordData] = await Promise.all([
          getUserInfo(),
          getRestaurantMyRecord(restaurant.id),
        ]);

        setUserInfo(userData);

        const records = Array.isArray(recordData)
          ? recordData
          : Array.isArray(recordData?.certs)
            ? recordData.certs
            : [];

        const nextMenuCountMap = {};

        records.forEach((record) => {
          const menuIds = Array.isArray(record.menu_ids)
            ? record.menu_ids
            : [];

          menuIds.forEach((menuId) => {
            nextMenuCountMap[menuId] =
              (nextMenuCountMap[menuId] ?? 0) + 1;
          });
        });

        setMenuCountMap(nextMenuCountMap);
      } catch (error) {
        console.error("인증 애니메이션 데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotionData();
  }, [restaurant?.id, navigate]);

  const handleConfirm = () => {
    navigate(returnTo, {
      replace: true,
      state: {
        selectedRestaurant: {
          ...restaurant,
          visitCount,
          visit_count: visitCount,
          isVisited: true,
          is_visited: true,
        },
        sheetMode: "expanded",
      },
    });
  };


  // 로딩 상태 처리
  if (isLoading) {
    return <div className="page-background" />;
  }

  return (
    <div className="page-background">
      <div className="mobile-container">
        {/* 매장 방문 정보 카드 */}
        <RestaurantInfoCard
          date={certDate}
          storeName={restaurant.name ?? "식당 이름"}
          category={
            restaurant.category === "Restaurant" ? "식당" : "카페"
          }
          totalVisitCount={`${visitCount}번 방문`}
        />

        {/* 주문한 메뉴 목록 */}
        <MenuList menuList={menuList} />

        {/* 유저 등급 및 XP 카드 */}
        <GradeCard userInfo={userInfo} />

        {/* 인증 확정 버튼 */}
        <CertConfirmButton onClick={handleConfirm} />
      </div>
    </div>
  );
}

export default CertMotionPage;