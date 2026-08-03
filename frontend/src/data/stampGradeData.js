import VisitStamp0 from "../assets/visit-stamp-0.svg";
import VisitStamp1 from "../assets/visit-stamp-1.svg";
import VisitStamp2 from "../assets/visit-stamp-2.svg";
import VisitStamp3 from "../assets/visit-stamp-3.svg";
import VisitStamp4 from "../assets/visit-stamp-4.svg";
import VisitStamp5 from "../assets/visit-stamp-5.svg";

export const visitGradeOptions = [
    {
        id: "nottry",
        name: "미도전 도장",
        maxXp: 0,
        description: "미방문",
        image: VisitStamp0,
    },

    {
        id: "firsttry",
        name: "첫입 도장",
        maxXp: 3,
        description: "3번 이하 방문",
        image: VisitStamp0,
    },

    {
        id: "againtry",
        name: "또먹 도장",
        minXp: 4,
        description: "4번 이상 방문",
        image: VisitStamp0,
    },

    {
        id: "favtry",
        name: "단골 도장",
        minXp: 15,
        description: "15번 이상 방문",
        image: VisitStamp0,
    },

    {
        id: "realfavtry",
        name: "찐맛집 도장",
        minXp: 30,
        description: "30번 이상 방문",
        image: VisitStamp0,
    },

    {
        id: "eatuptry",
        name: "잇업 도장",
        minXp: 100,
        description: "100번 이상 방문",
        image: VisitStamp0,
    },
]
