import SpoonGrade1 from "../assets/spoon_1.svg";
import SpoonGrade2 from "../assets/spoon_2.svg";
import SpoonGrade3 from "../assets/spoon_3.svg";
import SpoonGrade4 from "../assets/spoon_4.svg";
import SpoonGrade5 from "../assets/spoon_5.svg";
import SpoonGrade6 from "../assets/spoon_6.svg";
import SpoonGrade7 from "../assets/spoon_7.svg";

export const spoonGradeOptions = [
    {
        id: "singleUse",
        name: "일회용 수저",
        minXp: 0,
        maxXp: 1000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 0, maxXp: 1000 },
        ],
        image: SpoonGrade1,
    },

    {
        id: "stainless",
        name: "스테인리스 수저",
        minXp: 1001,
        maxXp: 7000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 1001, maxXp: 2500 },
            { level: 2, minXp: 2501, maxXp: 4500 },
            { level: 3, minXp: 4501, maxXp: 7000 },
        ],
        image: SpoonGrade2,
    },

    {
        id: "silver",
        name: "은수저",
        minXp: 7001,
        maxXp: 26000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 7001, maxXp: 10500 },
            { level: 2, minXp: 10501, maxXp: 15000 },
            { level: 3, minXp: 15001, maxXp: 20000 },
            { level: 4, minXp: 20001, maxXp: 26000 },
        ],
        image: SpoonGrade3,
    },

    {
        id: "gold",
        name: "금수저",
        minXp: 26001,
        maxXp: 86000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 26001, maxXp: 34000 },
            { level: 2, minXp: 34001, maxXp: 44000 },
            { level: 3, minXp: 44001, maxXp: 56000 },
            { level: 4, minXp: 56001, maxXp: 70000 },
            { level: 5, minXp: 70001, maxXp: 86000 },
        ],
        image: SpoonGrade4,
    },

    {
        id: "diamond",
        name: "다이아 수저",
        minXp: 86001,
        maxXp: 236000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 86001, maxXp: 106000 },
            { level: 2, minXp: 106001, maxXp: 131000 },
            { level: 3, minXp: 131001, maxXp: 161000 },
            { level: 4, minXp: 161001, maxXp: 196000 },
            { level: 5, minXp: 196001, maxXp: 236000 },
        ],
        image: SpoonGrade5,
    },

    {
        id: "omakase",
        name: "오마카세 수저",
        minXp: 236001,
        maxXp: 596000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 236001, maxXp: 286000 },
            { level: 2, minXp: 286001, maxXp: 346000 },
            { level: 3, minXp: 346001, maxXp: 416000 },
            { level: 4, minXp: 416001, maxXp: 496000 },
            { level: 5, minXp: 496001, maxXp: 596000 },
        ],
        image: SpoonGrade6,
    },

    {
        id: "eatUp",
        name: "잇업 수저",
        minXp: 596001,
        maxXp: 999999,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: 1, minXp: 596001, maxXp: 999999 },
        ],
        image: SpoonGrade7,
    },
]

export function getSpoonGradeByGrade(grade) {
  return (
    spoonGradeOptions.find((spoonGrade) => spoonGrade.grade === Number(grade)) ??
    spoonGradeOptions[0]
  );
}

/*export function getSpoonGradeByXp(xp) {
  const currentXp = Number(xp) || 0;

  return (
    spoonGradeOptions.find(
      (spoonGrade) =>
        currentXp >= spoonGrade.minXp && currentXp <= spoonGrade.maxXp
    ) ?? spoonGradeOptions[0]
  );
}*/