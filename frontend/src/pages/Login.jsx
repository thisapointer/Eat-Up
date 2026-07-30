import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { loginUser } from "../api/loginApi";
import "../styles/Login.css";

// 로그인 form 초기값
const initialLoginForm = {
  username: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();

  // 사용자가 입력한 아이디/비밀번호를 하나의 객체로 관리
  const [form, setForm] = useState(initialLoginForm);

  // 로그인 실패 또는 입력 검증 메시지
  const [errorMessage, setErrorMessage] = useState("");

  // 로그인 API 요청 중인지 저장 (중복 클릭을 막는 데 사용)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 아이디와 비밀번호가 모두 입력되었을 때만 로그인 버튼을 활성화
  const canSubmit = form.username.trim() && form.password;

  // input의 name과 form key를 맞춰두면 이 함수 하나로 모든 input을 처리 가능
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // user가 다시 입력하면 이전 에러 메시지 삭제
    setErrorMessage("");
  };

  // 로그인 버튼 눌렀을 때 실행
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await loginUser({
        username: form.username,
        password: form.password,
      });

      console.log("로그인 성공:", result);

      //로그인 성공 후 필요한 로그인 정보를 브라우저에 저장
      localStorage.setItem("accessToken", result.access_token); //이후 마이페이제이/인증/식당 api 요청시 Authorization 헤더에 사용
      localStorage.setItem("tokenType", result.token_type); //Authorization 헤더 만들 때 사용

      navigate("/map");
    }

    catch (error) {
      console.error("로그인 처리 중 에러:", error);

      if(error.status === 401) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다!");
        return;
      }

      setErrorMessage("로그인은 확인됐지만 처리 중 오류가 발생했습니다.")
    }

    finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <main className="login-page">
      {/* 상단 헤더 */}
      <header className="login-header">
        <BackButton className="login-back" />
        <h1>로그인</h1>
      </header>

      {/* 로그인 입력 영역 */}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="login-user-id">아이디</label>
          <input
            id="login-user-id"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="아이디"
          />
        </div>

        <div className="login-field">
          <label htmlFor="login-password">비밀번호</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
        </div>

        {errorMessage && <p className="login-error">{errorMessage}</p>}

        <button
          className="login-submit"
          type="submit"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "로그인 중" : "로그인 하기"}
        </button>
      </form>
    </main>
  );
}

export default Login;
