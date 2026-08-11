import SpoonGrade1 from "../assets/spoon_1.svg";
import SpoonGrade2 from "../assets/spoon_2.svg";
import SpoonGrade3 from "../assets/spoon_3.svg";
import SpoonGrade4 from "../assets/spoon_4.svg";
import SpoonGrade5 from "../assets/spoon_5.svg";
import SpoonGrade6 from "../assets/spoon_6.svg";
import SpoonGrade7 from "../assets/spoon_7.svg";

import SpoonGrade10 from "../assets/spoon_10.svg";
import SpoonGrade20 from "../assets/spoon_20.svg";
import SpoonGrade30 from "../assets/spoon_30.svg";
import SpoonGrade40 from "../assets/spoon_40.svg";
import SpoonGrade50 from "../assets/spoon_50.svg";
import SpoonGrade60 from "../assets/spoon_60.svg";
import SpoonGrade70 from "../assets/spoon_70.svg";


export const spoonGradeOptions = [
    {
        id: "singleUse",
        name: "일회용 수저",
        minXp: 0,
        maxXp: 1000,
        description: "당신의 맛집행! 이제 시작 입니다.",
        levels: [
            { level: "1호", minXp: 0, maxXp: 1000 },
        ],
        image: SpoonGrade1,
        imagespin: SpoonGrade10,
    },

    {
        id: "stainless",
        name: "스테인리스 수저",
        minXp: 1001,
        maxXp: 7000,
        description: "아직 맛집 내공을 쌓아가는 단계 입니다.",
        levels: [
            { level: "1호", minXp: 1001, maxXp: 2500 },
            { level: "2호", minXp: 2501, maxXp: 4500 },
            { level: "3호", minXp: 4501, maxXp: 7000 },
        ],
        image: SpoonGrade2,
        imagespin: SpoonGrade20,
    },

    {
        id: "silver",
        name: "은수저",
        minXp: 7001,
        maxXp: 26000,
        description: "당신은 진정한 식객에 입문했습니다.",
        levels: [
            { level: "1호", minXp: 7001, maxXp: 10500 },
            { level: "2호", minXp: 10501, maxXp: 15000 },
            { level: "3호", minXp: 15001, maxXp: 20000 },
            { level: "4호", minXp: 20001, maxXp: 26000 },
        ],
        image: SpoonGrade3,
        imagespin: SpoonGrade30,
    },

    {
        id: "gold",
        name: "금수저",
        minXp: 26001,
        maxXp: 86000,
        description: "당신은 이제 맛집이 무엇인지 아는 고수 입니다.",
        levels: [
            { level: "1호", minXp: 26001, maxXp: 34000 },
            { level: "2호", minXp: 34001, maxXp: 44000 },
            { level: "3호", minXp: 44001, maxXp: 56000 },
            { level: "4호", minXp: 56001, maxXp: 70000 },
            { level: "5호", minXp: 70001, maxXp: 86000 },
        ],
        image: SpoonGrade4,
        imagespin: SpoonGrade40,
    },

    {
        id: "diamond",
        name: "다이아 수저",
        minXp: 86001,
        maxXp: 236000,
        description: "지금까지 쌓은 수 많은 맛집 경험이 다이아몬드처럼 빛납니다.",
        levels: [
            { level: "1호", minXp: 86001, maxXp: 106000 },
            { level: "2호", minXp: 106001, maxXp: 131000 },
            { level: "3호", minXp: 131001, maxXp: 161000 },
            { level: "4호", minXp: 161001, maxXp: 196000 },
            { level: "5호", minXp: 196001, maxXp: 236000 },
        ],
        image: SpoonGrade5,
        imagespin: SpoonGrade50,
    },

    {
        id: "omakase",
        name: "오마카세 수저",
        minXp: 236001,
        maxXp: 596000,
        description: "당신은 맛집에 대한 깊은 깨달음을 얻고 벽을 넘어섰습니다.",
        levels: [
            { level: "1호", minXp: 236001, maxXp: 286000 },
            { level: "2호", minXp: 286001, maxXp: 346000 },
            { level: "3호", minXp: 346001, maxXp: 416000 },
            { level: "4호", minXp: 416001, maxXp: 496000 },
            { level: "5호", minXp: 496001, maxXp: 596000 },
        ],
        image: SpoonGrade6,
        imagespin: SpoonGrade60,
    },

    {
        id: "eatUp",
        name: "잇업 수저",
        minXp: 596001,
        maxXp: 999999,
        description: "당신은 이 서비스의 천하제일을 다툴 수 있는 경지에 올랐습니다.",
        levels: [
            { level: "만렙", minXp: 596001, maxXp: 999999 },
        ],
        image: SpoonGrade7,
        imagespin: SpoonGrade70,
    },
]

/*export function getSpoonGradeByGrade(grade) {
  return (
    spoonGradeOptions.find((spoonGrade) => spoonGrade.grade === Number(grade)) ??
    spoonGradeOptions[0]
  );
}*/

export function getSpoonGradeByXp(spoonXp = 0) {
  const grade =
    spoonGradeOptions.find(
      (option) => spoonXp >= option.minXp && spoonXp <= option.maxXp
    ) ?? spoonGradeOptions[spoonGradeOptions.length - 1];

  const currentLevel =
    grade.levels?.find(
      (level) => spoonXp >= level.minXp && spoonXp <= level.maxXp
    ) ?? grade.levels?.[0];

  return {
    ...grade,
    level: currentLevel?.level ?? 1,
  };
}

export function getSpoonGradeIndexByXp(spoonXp = 0) {
  const index = spoonGradeOptions.findIndex(
    (grade) => spoonXp >= grade.minXp && spoonXp <= grade.maxXp
  );

  return index === -1 ? spoonGradeOptions.length - 1 : index;
}