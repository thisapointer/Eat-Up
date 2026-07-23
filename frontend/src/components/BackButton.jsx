import backIcon from "../assets/backbutton.png";
import "../styles/BackButton.css";

function BackButton({
  className = "",
  label = "뒤로가기",
  onClick,
  iconSrc = backIcon,
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    window.history.back();
  };

  return (
    <button
      className={`back-button ${className}`}
      type="button"
      aria-label={label}
      onClick={handleClick}
    >
      <img className="back-button-icon" src={iconSrc} alt="" />
    </button>
  );
}

export default BackButton;