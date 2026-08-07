import VisitStamp0 from "../assets/visit-stamp-0.svg";
import VisitStamp1 from "../assets/visit-stamp-1.svg";
import VisitStamp2 from "../assets/visit-stamp-2.svg";
import VisitStamp3 from "../assets/visit-stamp-3.svg";
import VisitStamp4 from "../assets/visit-stamp-4.svg";
import VisitStamp5 from "../assets/visit-stamp-5.svg";

// 방문 횟수별 도장 기준입니다.
// 높은 방문 횟수부터 배치해야 find()가 가장 높은 등급을 먼저 찾습니다.
export const visitGradeOptions = [
  {
    id: "eatuptry",
    name: "잇업 도장",
    minVisitCount: 100,
    description: "100번 이상 방문",
    image: VisitStamp5,
  },
  {
    id: "realfavtry",
    name: "찐맛집 도장",
    minVisitCount: 30,
    description: "30번 이상 방문",
    image: VisitStamp4,
  },
  {
    id: "favtry",
    name: "단골 도장",
    minVisitCount: 15,
    description: "15번 이상 방문",
    image: VisitStamp3,
  },
  {
    id: "againtry",
    name: "또먹 도장",
    minVisitCount: 4,
    description: "4번 이상 방문",
    image: VisitStamp2,
  },
  {
    id: "firsttry",
    name: "첫입 도장",
    minVisitCount: 1,
    description: "3번 이하 방문",
    image: VisitStamp1,
  },
  {
    id: "nottry",
    name: "미도전 도장",
    minVisitCount: 0,
    description: "미방문",
    image: VisitStamp0,
  },
];

export function getStampGradeByVisitCount(visitCount = 0) {
  const stampGrade =
    visitGradeOptions.find(
      (stampGrade) => visitCount >= stampGrade.minVisitCount
    ) ?? visitGradeOptions[visitGradeOptions.length - 1];

  return {
    ...stampGrade,

    // 실제 도장 안에 보여줄 문구입니다.
    label: visitCount > 0 ? `${visitCount}번 방문` : "미방문",
  };
}