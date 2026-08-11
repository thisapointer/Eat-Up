import "../styles/DevCredit.css"; 
import BackButton from "../components/BackButton";
import BackButtonWhite from "../assets/backbuttonwhite.png";

//데이터 객체, 팀 정보 및 개발자 소개 수정 필요시 여기서 수정
const devCreditData = {
    title: "개발자 크레딧",
    team: {
        title: "2026 HICC 프로젝트 대회 7팀",
        description:
        "부대찌개 먹다가 결성된 팀에 선영디자이너님이 오시면서 이루어진 팀",
    },
    makers: [
        {
            name: "이서준",
            role: "PM",
            school: "홍익대학교 컴퓨터공학과 25학번",
            description: "PM을 맡았으며 기능 기획 총괄과 UX설계 총괄을 하였습니다.\n\n 어렵거나 힘들었던 점과 해결방법\n\n 1.초반에 혼자서 와이어 프레임을 잡고 UX 설계를 모두 하였는데 힘들었습니다. 다만 그 과정을 통해 실력이 커진 것을 느꼈습니다.\n\n 2. PM으로서 일하는 동안은 팀원들이 자꾸 집에 가고 싶어해서 스트레스를 받았지만 그래도 다들 일 하는 그 순간에는 열심히 해줘서 감사했습니다.",
        },
        {
            name: "임선영",
            role: "프론트엔드, 디자인",
            school: "홍익대학교 컴퓨터공학과 디자인예술경영학부 24학번",
            description: "디자인 전체를 총괄 하였고 기획과 UX설계를 보조 하였습니다.\n\n 프론트엔드 경험을 쌓고 싶었는데 막상해보니 디자인 작업을 더 많이 한 것 같아서 조금 아쉬웠습니다. 그래도 AI 도움을 받아 페이지 일부를 리액트로 구현하는 과정을 해보면서 프론트엔드의 구조를 조금이나마 배울 수 있어서 좋았습니다. 팀원들과 협업하며 기획 및 ux 설계, 문서작업 등의 개발 프로세스 전반을 경험한 것이 도움이 되었습니다.",
        },
        {
            name: "권정우",
            role: "백엔드",
            school: "홍익대학교 컴퓨터공학과 23학번",
            description: "erd api 명세서를 작성하고 백엔드 코드 작성과 서버, DB관리를 맡았습니다.\n\n 이런 프로젝트가 처음이라 모든 것이 어려웠고 부담스러웠지만 정신력으로 해냈습니다. ",
        },
        {
            name: "김주원",
            role: "프론트엔드",
            school: "홍익대학교 컴퓨터공학과 23학번",
            description: "프론트엔드 구현을 맡았습니다.\n\n 배움이 짧아 구현하는데 오랜 시간이 걸렸습니다. 처음 나가는 프로젝트 대회인데, 이번 프로젝트를 계기를 협업, 개발 방식등에 대해 잘 알게 되었습니다. Ai의 도움을 받긴 했지만 정말 많이 배웠습니다. 특히 카카오 지도 API 를 가져와 활용하는 부분에서도 많이 배웠습니다. 개발 기간이 제가 제일 늦어 걱정했을 팀원들께 죄송합니다. 하지만 끝까지 믿어주셔서 완성도 높은 결과가 나온 거 같습니다. 팀원들 덕분입니다. 감사합니다!",
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
