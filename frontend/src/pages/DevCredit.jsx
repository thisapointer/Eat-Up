import "../styles/DevCredit.css"; 
import BackButton from "../components/BackButton";
import BackButtonWhite from "../assets/backbuttonwhite.png";

//데이터 객체, 팀 정보 및 개발자 소개 수정 필요시 여기서 수정
const devCreditData = {
    title: "개발자 크레딧",
    team: {
        title: "2026 HICC 프로젝트 대회 7팀",
        description:
        "부대찌개 먹다가 결성된 팀에 선영누나누나가 오면서 이루어진 인연.....",
    },
    makers: [
        {
            name: "이서준",
            role: "PM",
            school: "홍익대학교 컴퓨터공학과 25학번",
            description: "..",
        },
        {
            name: "임선영",
            role: "프론트엔드, 디자인",
            school: "홍익대학교 컴퓨터공학과 디지털인문융합학과 24학번",
            description: "..",
        },
        {
            name: "권정우",
            role: "백엔드",
            school: "홍익대학교 컴퓨터공학과 23학번",
            description: "..",
        },
        {
            name: "김주원",
            role: "프론트엔드",
            school: "홍익대학교 컴퓨터공학과 23학번",
            description: "안녕하세요 잘 부탁드리겠습니다 너무 어려웠어요 코드 보는 게 세상에서 제일 어려웠어요",
        }
    ],
};

//실제 페이지 컴포넌트 
function DevCredit() {
    const { title, team, makers } = devCreditData; //devCreditData.title 등을 짧게 사용하기 위함

    return (
        <main className="dev-credit-page">
            {/* 화면 상단 공통 헤더 */}
            <header className="dev-credit-header">
                <BackButton className="dev-credit-back" iconSrc={BackButtonWhite} />
                <h1>{title}</h1>
            </header>

            {/* 프로젝트 팀 소개 영역 */}
            <section className="dev-credit-section" aria-labelledby="dev-credit-team">
                <div className="dev-credit-panel dev-credit-panel--intro">
                <h2 id="dev-credit-team">{team.title}</h2>
                <p>{team.description}</p>
                </div>
            </section>

            {/* 제작진 목록 영역 */}
            <section
                className="dev-credit-section dev-credit-section--makers"
                aria-labelledby="dev-credit-makers"
            >
                <h2 id="dev-credit-makers" className="dev-credit-section-title">
                제작진
                </h2>

                <div className="dev-credit-list">
                    {/*배열에 있는 데이터 순회하면서 카드 ui 생성 */}
                    {makers.map((maker) => (
                        <article
                        className="dev-credit-card dev-credit-panel dev-credit-panel--maker"
                        key={`${maker.name}-${maker.role}`} //각 항목 구분
                        >
                        <div className="dev-credit-maker-heading">
                            <strong>
                                {maker.name}  
                                <span>{maker.role}</span>
                            </strong>
                            <p>{maker.school}</p>
                        </div>
                        {maker.description && <p className="dev-credit-maker-description">{maker.description}</p>} {/*description 있을 때만 <p> 태그 보여줌 */}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default DevCredit;
