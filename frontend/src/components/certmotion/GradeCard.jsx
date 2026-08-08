import React, { useMemo } from "react";
import { getSpoonGradeByGrade } from "../../data/spoonGradeData";
import Spoon1Icon from "../../assets/spoon_1.svg";
import "../../styles/certmotion/GradeCard.css";

// 숫자 XP를 포맷팅하는 헬퍼 함수
function formatXp(value) {
  return `${(value || 0).toLocaleString()}XP`;
}

export default function GradeCard({ userInfo }) {
  // 유저의 등급 정보 계산 (기본값: 2등급 금수저)
  const gradeNum = userInfo?.spoon_grade ?? 2;
  const currentSpoonGrade = getSpoonGradeByGrade(gradeNum);

  // 등급 카드 데이터 정률화
  const gradeName = currentSpoonGrade?.name ?? "금수저";
  const gradeLevel = currentSpoonGrade?.level ?? 2;
  const currentXp = userInfo?.spoon_xp ?? 7800;
  const minXp = currentSpoonGrade?.minXp ?? 0;
  const nextGradeXp = currentSpoonGrade?.maxXp ?? 16000;

  // 프로그레스 바 진행률(%) 계산
  const progressPercent = useMemo(() => {
    const totalRange = nextGradeXp - minXp;
    const currentProgress = currentXp - minXp;

    if (totalRange <= 0) return 0;
    return Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));
  }, [currentXp, minXp, nextGradeXp]);

  // 레벨업까지 남은 XP
  const remainingXp = Math.max(0, nextGradeXp - currentXp);

  return (
    <div className="cert-card cert-grade-card">
      {/* 왼쪽: 수저 아이콘 */}
      <div className="cert-grade-visual">
        <img
          src={Spoon1Icon}
          alt={`${gradeName} 아이콘`}
          className="cert-spoon-image"
        />
      </div>

      {/* 오른쪽: 등급명, 프로그레스 바, XP 정보 */}
      <div className="cert-grade-info">
        <h2 className="cert-grade-title">
          {gradeName} {gradeLevel}호
        </h2>

        {/* 프로그레스 바 */}
        <div className="cert-progress-bg">
          <div
            className="cert-progress-fill"
            style={{ '--target-width': `${progressPercent}%` }}
          />
        </div>

        {/* 현재 XP 및 레벨업 남은 XP */}
        <div className="cert-xp-group">
          <span className="cert-xp-current">
            현재 {formatXp(currentXp)}
          </span>
          <span className="cert-xp-target">
            레벨업까지 {formatXp(remainingXp)}
          </span>
        </div>
      </div>
    </div>
  );
}