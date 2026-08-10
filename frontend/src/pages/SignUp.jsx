import BackButton from "../components/BackButton";

import {checkUserId, signUpUser} from "../api/authApi";

import {useNavigate} from 'react-router-dom';
import {useState} from 'react';

import ProfilePhoto from "../assets/profile_photo.svg";

import "../styles/SignUp.css";

// 회원가입 단계 정보 단계가 추가/삭제되면 이 배열을 먼저 수정
// 화면 상단 stepper와 현재 보여줄 input 영역을 이 배열 기준으로 맞춤
const signUpSteps = [
  {
    key: "id",
    label: "아이디 설정",
  },
  {
    key: "password",
    label: "비밀번호 설정",
  },
  {
    key: "profile",
    label: "프로필 만들기",
  },
];

const USER_ID_PATTERN = /^[A-Za-z0-9]{1,15}$/;
const PASSWORD_PATTERN =/^(?=.{1,30}$)(?!.*\s)[\x21-\x7E]+$/;
const NICKNAME_PATTERN =/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]{1,20}$/;

//회원가입 form 초기값
const initialForm = {
  user_id : "", //수정 할 수 없음을 명시(영어랑 숫자로만), 최대 15자, 중복확인 
  password : "", //30자내 제한(영어, 숫자, 특수문자)
  passwordConfirm : "", // 비밀번호 확인용, 백엔드로 넘기지 않음
  nickname : "", //닉네임 바꿀 수 있음(한글, 숫자, 영어, 특수문자), 20자 이내
  provider : "local", //로그인 방식
  //profile_img : "",  //프사 권한요청, 회원가입시 프사 설정 가능 --> api 문서 교차확인 필요
};

function SignUp() {
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0); //현재 회원가입 단계(0-아이디, 1-비밀번호, 2-프로필사진)
  const [form, setForm] = useState(initialForm); //사용자가 입력한 전체 form 값을 하나의 객체로 관리
  const [userIdMessage, setUserIdMessage] = useState(""); //아이디 중복 확인 관련 안내 메세지
  const [errorMessage, setErrorMessage] = useState(""); //회원가입 전체 검증/API 실패 메세지
  const [isUserIdChecked, setIsUserIdChecked] = useState(false); //아이디 중복 확인 완료했는지 저장하는 state

  const currentStep = signUpSteps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === signUpSteps.length-1;

  /*여러 input 값을 하나의 함수로 처리(공통변경함수)
  만약 input/select 값이 바뀔 때 해당 필드만 업데이트 하면됨*/
  //input의 name과 form key를 맞춰두면 모든 input을 이 함수 하나로 처리 가능
  const handleChange = (event) => {
    const {name, value} = event.target;

    setForm((prevForm) => ({
      ...prevForm, 
        [name] : value,
    }));

    //아이디를 바꾸면 이전 중복확인 결과는 유효하지 않도록 함
    if (name === "user_id") {
      setIsUserIdChecked(false); 
      setUserIdMessage("");
    }
  };


  //"아이디 중복확인" 버튼을 눌렀을 때 실행
  const handleCheckUserId = async() => {
    
    //아이디 입력값 비어 있을시 api 요청 보내지 않고 error 메세지 표시
    if (!form.user_id.trim()) {
      setUserIdMessage("아이디를 입력해주세요.");
      setIsUserIdChecked(false);
      return;
    }

    if (!USER_ID_PATTERN.test(form.user_id)) {
      setUserIdMessage("아이디는 영문과 숫자로만 15자 이내로 입력해주세요.");
      setIsUserIdChecked(false);
      return;
    }

    try { 
      const result = await checkUserId(form.user_id);

      //백엔드 응답에서 true 면 사용 가능한 아이디 
      if (result) {
        //이전 에러 메세지 지우고 아이디 중복확인이 완료된 state 저장 
        setUserIdMessage("사용 가능한 아이디입니다.");
        setIsUserIdChecked(true);
        return;
      }

      else {
        setUserIdMessage("이미 사용중인 아이디입니다.");
        setIsUserIdChecked(false);
      }
    }

    catch (error) {
      setUserIdMessage("아이디 중복 확인 중 오류 발생")
      setIsUserIdChecked(false);
    }
  };

  // 현재 단계에서 다음 단계로 넘어가도 되는지 확인
  const validateCurrentStep = () => {
    setErrorMessage("");

    if (currentStep.key === "id") {
      if (!form.user_id.trim()) {
        setUserIdMessage("아이디를 입력해주세요.");
        return false;
      }

      if (!isUserIdChecked) {
        setUserIdMessage("아이디 중복 확인을 먼저 해주세요.");
        return false;
      }
    }

    if (currentStep.key === "password") {
      if (!form.password || !form.passwordConfirm) {
        setErrorMessage("비밀번호를 입력해주세요.");
        return false;
      }

      if(!PASSWORD_PATTERN.test(form.password)) {
        setErrorMessage(
          "비밀번호는 공백 없이 영문, 숫자, 특수문자로 30자 이내로 입력해주세요."
        )
      }

      if (form.password !== form.passwordConfirm) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        return false;
      }
    }

    if (currentStep.key === "profile") {
      if (!form.nickname.trim()) {
        setErrorMessage("닉네임을 입력해주세요");
        return false;
      }

      if(!NICKNAME_PATTERN.test(form.nickname)) {
        setErrorMessage("닉네임은 공백 없이 한글, 영문, 숫자, 특수문자로 20자 이내로 입력해주세요.")
      }
    }

    return true;
  
  };


  //backend RequestBody 형식에 맞게 변경
  //input 값은 대다수 문자열 고정이기 때문에 요청하는 필드 변환 필수
  const buildRequestBody = () => ({
    user_id: form.user_id,
    password: form.password,
    nickname: form.nickname,
    provider: form.provider,
    //profile_img: form.profile_img,
  });

  // 마지막 단계에서 가입완료 버튼을 눌렀을 때 실제 회원가입 API를 호출
  const submitSignUp = async () => {
    try {
      const result = await signUpUser(buildRequestBody());

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } 
    
    catch (error) {
      console.error("회원가입 실패:", error);

      if (error.status === 409) {
        setErrorMessage("이미 사용 중인 아이디입니다.");
        setIsUserIdChecked(false);
        setStepIndex(0);
        return;
      }

      if (error.status === 400) {
        setErrorMessage("입력값을 다시 확인해주세요.");
        return;
      }

      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    }
  };

  // 확인/가입완료 버튼 클릭 시 실행합니다.
  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (isLastStep) {
      await submitSignUp();
      return;
    }

    setStepIndex((prevStep) => prevStep + 1);
  };

  // 이전 단계 버튼 또는 상단 BackButton 클릭 시 실행합니다.
  const handlePrev = () => {
    setErrorMessage("");

    if (isFirstStep) {
      navigate(-1);
      return;
    }

    setStepIndex((prevStep) => prevStep - 1);
  };


   return (
    <main className="signup-page">
      {/* 상단 헤더 */}
      <header className="signup-header">
        <BackButton className="signup-back" onClick={handlePrev} />
        <h1>회원가입</h1>
      </header>

      {/* 회원가입 단계 표시 */}
      <section className="signup-stepper" aria-label="회원가입 단계">
        {signUpSteps.map((step, index) => {
          const isComplete = index < stepIndex;
          const isActive = index === stepIndex;

          return (
            <div
              className={`signup-step ${
                isComplete ? "signup-step--complete" : ""
              } ${isActive ? "signup-step--active" : ""}`}
              key={step.key}
            >
              <span className="signup-step-dot">
                {isComplete ? "✓" : ""}
              </span>
              <span className="signup-step-label">{step.label}</span>
            </div>
          );
        })}
      </section>

      {/* 단계별 입력 영역 */}
      <section className="signup-content" aria-labelledby="signup-form-title">
        <h2 id="signup-form-title" className="signup-hidden-title">
          {currentStep.label}
        </h2>

        {currentStep.key === "id" && (
          <div className="signup-form-stack">
            <div className="signup-form-group">
              <div className="signup-label-row">
                <label htmlFor="signup-user-id">아이디</label>
                <span className="signup-field-rule">
                  영문/숫자만, 최대15자. 가입 후 변경이 불가합니다.
                </span>
              </div>
              <div className="signup-inline-field">
                <input
                  id="signup-user-id"
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                  maxLength={15}
                  autoComplete="username"
                />
                <button className="signup-check-button" type="button" onClick={handleCheckUserId}>
                  중복확인
                </button>
              </div>
              {userIdMessage && <p className="signup-help">{userIdMessage}</p>}
            </div>
          </div>
        )}

        {currentStep.key === "password" && (
          <div className="signup-form-stack">
            <div className="signup-form-group">
              <div className="signup-label-row">
                <label htmlFor="signup-password">비밀번호</label>
                <span className="signup-field-rule">
                  최대 30자 / 영문,숫자,특수문자만 사용 가능합니다.
                </span>
              </div>
              <input
                id="signup-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                maxLength={30}
                autoComplete="new-password"
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="signup-password-confirm">비밀번호 확인</label>
              <input
                id="signup-password-confirm"
                name="passwordConfirm"
                type="password"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>
        )}

        {currentStep.key === "profile" && (
          <div className="signup-profile">
            <div className="signup-profile-img">
              <img
                src={ProfilePhoto}
                alt="기본 프로필"
              />
            </div>
            <div className="signup-form-group">
              <div className="signup-label-row">
                <label htmlFor="signup-nickname">닉네임</label>
                <span className="signup-field-rule">
                  최대20자 / 한글,영문,숫자,특수문자만 사용 가능합니다.
                </span>
              </div>
              <input
                id="signup-nickname"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                autoComplete="nickname"
              />
            </div>
          </div>
        )}

        {errorMessage && <p className="signup-error">{errorMessage}</p>}
      </section>

      {/* 하단 버튼 영역 */}
      <footer className="signup-actions">
        {!isFirstStep && (
          <button
            className="signup-button signup-button--ghost"
            type="button"
            onClick={handlePrev}
          >
            이전 단계
          </button>
        )}

        <button
          className={`signup-button ${
            isLastStep ? "signup-button--orange" : "signup-button--black"
          }`}
          type="button"
          onClick={handleNext}
        >
          {isLastStep ? "가입완료" : "확인"}
        </button>
      </footer>
    </main>
  );
}

export default SignUp;
