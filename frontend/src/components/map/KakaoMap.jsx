import { useEffect, useRef } from "react";

import "../../styles/KakaoMap.css";

function KakaoMap() {
  // mapRef는 실제 지도 div를 가리키는 변수
  const mapRef = useRef(null);

  // useEffect는 컴포넌트가 화면에 나타난 뒤 실행
  // 지도 div가 실제 DOM에 생긴 다음 카카오 지도를 생성해야 하므로 useEffect 안에서 실행
  useEffect(() => {
    // window.kakao X - 카카오 지도 SDK가 아직 로드되지 않은 상태
    // mapRef.current X - 지도 div가 아직 준비되지 않은 상태
    // 둘 중 하나라도 없으면 지도 생성을 중단
    if (!window.kakao || !window.kakao.maps || !mapRef.current) {
      return;
    }

    const mapOption = {
      // 지도 중심 좌표(홍익대학교) ,LatLng(위도, 경도) 순서 
      center: new window.kakao.maps.LatLng(37.550751, 126.925506),

      // 지도 확대 레벨
      level: 3,
    };

    // 실제 카카오 지도 객체를 생성
    // 첫 번째 인자: 지도를 넣을 div
    // 두 번째 인자: 지도 옵션
    new window.kakao.maps.Map(mapRef.current, mapOption);
  }, []);

  // 카카오 지도가 들어갈 빈 div
  // ref={mapRef}를 통해 위 useEffect에서 이 div를 사용 가능
  return <div ref={mapRef} className="kakao-map" />;
}

export default KakaoMap;