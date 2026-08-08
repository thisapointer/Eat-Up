import { getMenuStampByCount } from "../../data/menuStampData";
import "../../styles/MenuStampBadge.css";

function MenuStampBadge({ count = 0 }) {
  const stamp = getMenuStampByCount(count);

  return (
    <div className="menu-stamp-badge">
      <img src={stamp.image} alt="" aria-hidden="true" />

      {/* 미도전 도장은 SVG 안 글자를 그대로 쓰기 때문에 텍스트를 올리지 않습니다. */}
      {stamp.showLabel && (
        <span
          className="menu-stamp-label"
          style={{ color: stamp.labelColor }}
        >
          {stamp.label}
        </span>
      )}
    </div>
  );
}

export default MenuStampBadge;