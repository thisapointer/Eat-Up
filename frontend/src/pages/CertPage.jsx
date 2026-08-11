import { getMenuList } from "../api/menuApi";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import BackButton from "../components/BackButton";
import "../styles/CertPage.css";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth()+1).padStart(2,"0");
  const date = String(today.getDate()).padStart(2,"0");

  return `${year}-${month}-${date}`;
}

function CertPage() {
  const { restId } = useParams(); //url 에서 restId 가져옴
  const location = useLocation(); //바텀시트에서 넘긴 restaurant 정보를 받을 때 사용
  const navigate = useNavigate(); //ConfirmPage로 이동시 사용

  const returnTo = location.state?.returnTo ?? "/map";

  const restaurant = location.state?.restaurant; //바텀시트에서 넘겨준 식당 정보, 없을수도 있으므로 optional 처리

  const initialSelectedMenus = location.state?.selectedMenus ?? [];
  const initialCertDate = location.state?.certDate ?? getTodayDate();

  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState(initialSelectedMenus);
  const [certDate, setCertDate] = useState(initialCertDate);

  useEffect(() => {
    const fetchMenus = async() => {
      const data = await getMenuList(restId);
      setMenus(Array.isArray(data) ? data : []);
    };

    if(restId) {
      fetchMenus();
    }
  }, [restId]);

  const handleToggleMenu = (menu) => {
    setSelectedMenus((prevMenus) => {
      const isSelected = prevMenus.some((selectedMenu) => selectedMenu.id === menu.id );

      if(isSelected) {
        return prevMenus.filter((selectedMenu) => selectedMenu.id !== menu.id);
      }

      return [...prevMenus, menu];
    });
  };

  const handleBack = () => {
    navigate("/map", {
      replace: true,
      state: {
        restaurant,
      },
    });
  };

  const handleComplete = () => {
    navigate(`/rests/${restId}/confirm`, {
      state: {
        restaurant,
        selectedMenus,
        certDate,
        returnTo,
      },
    });
  };

  return (
    <main className="cert-page">
      <header className="cert-header">
        <BackButton onClick={handleBack} />
        <h1>인증하기</h1>
      </header>

      <section className="cert-restaurant-info">
        <input
          type="date"
          value={certDate}
          onChange={(event) => setCertDate(event.target.value)}
        />

        <h2>
          {restaurant?.name ?? "식당 이름"}
          <span>{restaurant?.category ?? ""}</span>
        </h2>
      </section>

      <section className="cert-menu-section">
        <h2>메뉴 선택</h2>

        <div className="cert-menu-list">
          {menus.map((menu) => {
            const isSelected = selectedMenus.some(
              (selectedMenu) => selectedMenu.id === menu.id
            );

            return (
              <button
                className={
                  isSelected
                    ? "cert-menu-card cert-menu-card--selected"
                    : "cert-menu-card"
                }
                type="button"
                key={menu.id}
                onClick={() => handleToggleMenu(menu)}
              >
                <img src={menu.img ?? ""} alt="" />
                <div>
                  <strong>{menu.name}</strong>
                  <span>{menu.price?.toLocaleString?.() ?? menu.price}원</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <button
        className="cert-complete-button"
        type="button"
        onClick={handleComplete}
        disabled={selectedMenus.length === 0}
      >
        메뉴 선택 완료
      </button>
    </main>
  );
}

export default CertPage;