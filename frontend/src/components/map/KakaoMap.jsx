import { useEffect, useRef } from "react";

import "../../styles/KakaoMap.css";

import MarkerDefault from "../../assets/default-marker.svg";
import MarkerDefaultSelected from "../../assets/default-marker-selected.svg";
import MarkerDefaultVisited from "../../assets/default-visited-marker.svg";
import MarkerDefaultVisitedSelected from "../../assets/default-visited-marker-selected.svg";
import MarkerLikedUnvisited from "../../assets/liked-unvisited-marker.svg";
import MarkerLikedVisited from "../../assets/liked-visited-marker.svg";

function KakaoMap({restaurants= [], selectedRestaurantId, onMarkerClick}) {

  // mapRef는 실제 지도 div를 가리키는 변수
  const mapRef = useRef(null);

  //카카오 지도 객체 저장 - 지도는 한 번만 만듦, 마커만 다시 그리기 위해 따로 저장
  const kakaoMapRef = useRef(null);

  //지도 위에 찍힌 마커 저장 - restaurants 가 바뀔 때 기존 마커 지우기 위해 저장
  const mapObjectRefs = useRef([]);

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
    kakaoMapRef.current = new window.kakao.maps.Map(mapRef.current, mapOption);
  }, []);

  //바뀔 때마다 마커 다시 그림
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps || !kakaoMapRef.current) {
      return;
    }

    const map = kakaoMapRef.current;
  
    // 기존에 찍혀 있던 마커들을 지도에서 제거
    mapObjectRefs.current.forEach((mapObject) => {
      mapObject.setMap(null);
    });

    mapObjectRefs.current = [];

    if (!restaurants.length) {
      return;
    }


    const bounds = new window.kakao.maps.LatLngBounds();

    restaurants.forEach((restaurant) => {
      // 백엔드 필드명이 lat/lng 또는 x/y일 수 있어서 둘 다 대응 (확정시 수정)
      const lat = restaurant.lat ?? restaurant.latitude ?? restaurant.addr?.y;
      const lng = restaurant.lng ?? restaurant.longitude ?? restaurant.addr?.x;

      // 좌표가 없으면 카카오 지도에 마커 X
      if (!lat || !lng) {
        return;
      }

      const position = new window.kakao.maps.LatLng(lat, lng);

      const isSelected = restaurant.id === selectedRestaurantId;
      const isLiked = restaurant.isLiked ?? restaurant.is_liked ?? false;
      const isVisited = restaurant.isVisited ?? restaurant.is_visited ?? false;
      
      //찜 X 인 식당들은 말풍선 + 식당명 CustomOverlay로 표시
      if(!isLiked) {
        const content = createBubbleMarkerContent(restaurant, isVisited, isSelected, onMarkerClick);

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1,
        });

        overlay.setMap(map);

        mapObjectRefs.current.push(overlay);
        bounds.extend(position);
        return;
      }

      //찜 O 인 식당은 아이콘 마커만 표시
      const markerImageSrc = isVisited
        ? MarkerLikedVisited
        : MarkerLikedUnvisited;

      const markerImage = new window.kakao.maps.MarkerImage(
        markerImageSrc,
        new window.kakao.maps.Size(48, 48),
        {
          offset: new window.kakao.maps.Point(24, 48),
        }
      );

      const marker = new window.kakao.maps.Marker({
        map,
        position,
        image: markerImage,
        title: restaurant.name,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        onMarkerClick?.(restaurant);
      });

      mapObjectRefs.current.push(marker);
      bounds.extend(position);
    });

    // 마커가 하나 이상 있으면 모든 마커가 보이도록 지도 범위 조정
    if (mapObjectRefs.current.length > 0) {
      map.setBounds(bounds);
    }
  }, [restaurants, selectedRestaurantId, onMarkerClick]);

  // 카카오 지도가 들어갈 빈 div
  // ref={mapRef}를 통해 위 useEffect에서 이 div를 사용 가능
  return <div ref={mapRef} className="kakao-map" />;
}

//1,2번 말풍선 마커(식당 이름 제외)
function createBubbleMarkerContent(restaurant, isVisited, isSelected, onMarkerClick) {
  //버튼 element 직접 만듦 -- addEventListener 붙일 수 있음
  const button = document.createElement("button");

  const markerTypeClass = isVisited
    ? "restaurant-map-marker--visited"
    : "restaurant-map-marker--default";

  button.className = isSelected
    ? `restaurant-map-marker ${markerTypeClass} restaurant-map-marker--selected`
    : `restaurant-map-marker ${markerTypeClass}`;

  button.type = "button";

  const icon = document.createElement("img");
  icon.className = "restaurant-map-marker-icon";
  icon.src = getBubbleMarkerIcon(isVisited, isSelected);
  icon.alt = "";

  const name = document.createElement("span");
  name.className = "restaurant-map-marker-name";
  name.textContent = restaurant.name;

  button.appendChild(icon);
  button.appendChild(name);

  button.addEventListener("click", () => {
    onMarkerClick?.(restaurant);
  });

  return button;
}

//말풍선 필요한 이미지 svg 선택
function getBubbleMarkerIcon(isVisited, isSelected) {
  if (isVisited) {
    return isSelected ? MarkerDefaultVisitedSelected : MarkerDefaultVisited;
  }

  return isSelected ? MarkerDefaultSelected : MarkerDefault;
}

export default KakaoMap;