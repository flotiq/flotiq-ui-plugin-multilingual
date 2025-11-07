import arrowIcon from "inline:../../../images/arrow_icon.svg";

export const createTabsArrowsElement = (tabsContainer) => {
  const leftArrow = document.createElement("button");
  leftArrow.className =
    "plugin-multilingual-tabs-arrow plugin-multilingual-tabs-arrow--left";
  leftArrow.type = "button";
  leftArrow.innerHTML = arrowIcon;

  const rightArrow = document.createElement("button");
  rightArrow.className =
    "plugin-multilingual-tabs-arrow plugin-multilingual-tabs-arrow--right";
  rightArrow.type = "button";
  rightArrow.innerHTML = arrowIcon;

  const updateArrows = () => {
    const { scrollLeft, scrollWidth, clientWidth } = tabsContainer;
    leftArrow.disabled = scrollLeft <= 0;
    rightArrow.disabled = scrollLeft >= scrollWidth - clientWidth;
  };

  const scrollTabs = (direction) => {
    const scrollAmount =
      window.innerWidth < 500
        ? tabsContainer.clientWidth
        : tabsContainer.clientWidth * (3 / 4);
    const currentScroll = tabsContainer.scrollLeft;

    if (direction === "left") {
      const targetScroll = Math.max(0, currentScroll - scrollAmount);

      if (targetScroll < 50) {
        tabsContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        tabsContainer.scrollTo({
          left: targetScroll - leftArrow.clientWidth,
          behavior: "smooth",
        });
      }
    } else {
      tabsContainer.scrollTo({
        left: currentScroll + scrollAmount - leftArrow.clientWidth,
        behavior: "smooth",
      });
    }
  };

  leftArrow.onclick = () => scrollTabs("left");
  rightArrow.onclick = () => scrollTabs("right");

  tabsContainer.addEventListener("scroll", updateArrows);

  return { leftArrow, rightArrow };
};
