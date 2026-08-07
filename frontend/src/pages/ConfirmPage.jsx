import { getMenuList } from "../api/menuApi";
import { postCertRecord } from "../api/certApi";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import "../styles/ConfirmPage.css"
import BackButton from "../components/BackButton";

function formatPrice(price) {
  const numberPrice = Number(price);

  if (!numberPrice) {
    return "0원";
  }

  return `${numberPrice.toLocaleString()}원`;
}

function ConfirmPage() {
  const { restId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // CertPage에서 navigate state로 넘겨준 값입니다.
  const restaurant = location.state?.restaurant;
  const selectedMenus = location.state?.selectedMenus ?? [];
  const certDate = location.state?.certDate ?? "";

  // 수정하기 버튼: 이전 메뉴 선택 페이지로 돌아갑니다.
  const handleEdit = () => {
    navigate(-1);
  };

  // 지금은 UI만 먼저. API 연결은 나중에 여기서 postCertRecord 호출하면 됩니다.
  const handleSubmit = () => {
    console.log("인증 완료 예정:", {
      restId,
      certDate,
      selectedMenus,
    });
  };

  return (
    <main className="confirm-page">
      <header className="confirm-header">
        <BackButton />
        <h1>인증하기</h1>
      </header>

      <section className="confirm-restaurant-info">
        <p>{certDate}</p>

        <h2>
          {restaurant?.name ?? "식당 이름"}
          <span>{restaurant?.category ?? ""}</span>
        </h2>
      </section>

      <section className="confirm-menu-section">
        <h2>먹은 메뉴</h2>

        <div className="confirm-menu-list">
          {selectedMenus.map((menu) => (
            <article className="confirm-menu-card" key={menu.id}>
              <img src={menu.img ?? ""} alt="" />

              <div>
                <strong>{menu.name}</strong>
                <span>{formatPrice(menu.price)}</span>
              </div>
            </article>
          ))}
        </div>

        {selectedMenus.length === 0 && (
          <p className="confirm-empty-message">
            선택한 메뉴가 없습니다.
          </p>
        )}
      </section>

      <div className="confirm-action-row">
        <button
          className="confirm-action-button confirm-action-button--edit"
          type="button"
          onClick={handleEdit}
        >
          수정하기
        </button>

        <button
          className="confirm-action-button confirm-action-button--submit"
          type="button"
          onClick={handleSubmit}
          disabled={selectedMenus.length === 0}
        >
          인증 완료하기
        </button>
      </div>
    </main>
  );
}

export default ConfirmPage;