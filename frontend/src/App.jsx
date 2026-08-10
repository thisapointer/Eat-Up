import {BrowserRouter, Routes, Route} from 'react-router-dom';

//import 공통 메인 레이아웃, 들어올 예정
import MainLayout from "./layouts/MainLayout";
import "./styles/MainLayout.css";


//import 페이지 컴포넌트
import CertPage from "./pages/CertPage";
import ConfirmPage from "./pages/ConfirmPage";
import DevCredit from "./pages/DevCredit";
import FirstPage from "./pages/FirstPage";
import ListUp from "./pages/ListUp";
import Login from "./pages/Login";
import MapsMain from "./pages/MapsMain";
import MyPage from "./pages/MyPage";
import SignUp from "./pages/SignUp";
import RecordsPage from "./pages/RecordsPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import SplashPage from "./pages/SplashPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";



//프로젝트 전체 라우팅 컴포넌트
function App() {
    return (
        <BrowserRouter> {/*URL 기준으로 페이지 이동*/ }
            <Routes> {/*여러 route를 감싸는 라우팅 묶음*/}

                {/* 시작 / 인증 */}
                <Route path="/start" element={<FirstPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<SplashPage />} />

                {/* 하단 탭바가 필요한 페이지 */}
                <Route element={<MainLayout />}>
                    <Route path="/map" element={<MapsMain />} />
                    <Route path="/list" element={<ListUp />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Route>

                {/* 식당 상세 / 인증 플로우 */}
                <Route path="/rests/:restId/cert" element={<CertPage />} />
                <Route path="/rests/:restId/confirm" element={<ConfirmPage />} />

                {/* 마이페이지 하위 화면 */}
                <Route path="/mypage/records" element={<RecordsPage />} />
                <Route path="/mypage/profile" element={<ProfileEditPage />} />
                <Route path="mypage/delete" element={<DeleteAccountPage />} />

                {/* 기타 */}
                <Route path="/dev-credit" element={<DevCredit />} />
            </Routes>
        </BrowserRouter>
    );   
}

export default App;