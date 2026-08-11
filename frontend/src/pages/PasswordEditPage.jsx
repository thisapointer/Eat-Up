import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "../styles/AccountEdit.css";
import { updateMyUserInfo } from "../api/mypageApi";

function PasswordEditPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const isMatched =
    form.newPassword &&
    form.newPassword === form.confirmPassword;


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.newPassword || !isMatched) {
      return;
    }

    try {
      await updateMyUserInfo({
        password: form.newPassword,
      });

      navigate("/mypage/profile", { replace: true });
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
    }
  };

  return (
    <main className="account-edit-page">
      <header className="account-edit-header">
        <BackButton />
        <h1>비밀번호 변경</h1>
      </header>

      <form className="account-edit-form" onSubmit={handleSubmit}>
        <label htmlFor="newPassword">새 비밀번호</label>

        <div className="account-edit-password-fields">
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            maxLength={30}
            value={form.newPassword}
            placeholder="새 비밀번호"
            onChange={handleChange}
          />

          <input
            name="confirmPassword"
            type="password"
            maxLength={30}
            value={form.confirmPassword}
            placeholder="새 비밀번호 확인"
            onChange={handleChange}
          />
        </div>

        {form.confirmPassword && !isMatched && (
          <p className="account-edit-error">
            비밀번호가 일치하지 않습니다.
          </p>
        )}

        <button type="submit" disabled={!isMatched}>
          비밀번호 변경
        </button>
      </form>
    </main>
  );
}

export default PasswordEditPage;