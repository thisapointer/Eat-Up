import MenuStamp0 from "../assets/menu-stamp-0.svg";
import MenuStamp1 from "../assets/menu-stamp-1.svg";

export function getMenuStampByCount(count = 0) {
  if (count <= 0) {
    return {
      image: MenuStamp0,
      label: "",
      labelColor: "#9a9a9a",
      showLabel: false,
    };
  }

  return {
    image: MenuStamp1,
    label: `${count}번`,
    labelColor: "#ff5b00",
    showLabel: true,
  };
}