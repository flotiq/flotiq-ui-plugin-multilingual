import arrowIcon from "inline:../../../images/arrow_icon.svg";

export const createTabsArrowsElement = (tabsContainer, tabsInner) => {
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

  const findFirstVisibleTab = (scrollPosition) => {
    const tabs = Array.from(tabsInner.children);

    for (const tab of tabs) {
      const tabLeft = tab.offsetLeft;
      if (tabLeft >= scrollPosition) {
        return tab;
      }
      if (tabLeft + tab.offsetWidth > scrollPosition) {
        return tab;
      }
    }
    return tabs[tabs.length - 1];
  };

  const scrollTabs = (direction) => {
    const scrollAmount = tabsContainer.clientWidth / 2;
    const currentScroll = tabsContainer.scrollLeft;

    if (direction === "left") {
      const targetScroll = Math.max(0, currentScroll - scrollAmount);

      if (targetScroll < 50) {
        tabsContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const targetTab = findFirstVisibleTab(targetScroll);

        tabsContainer.scrollTo({
          left: targetTab.offsetLeft - leftArrow.clientWidth,
          behavior: "smooth",
        });
      }
    } else {
      const targetScroll = currentScroll + scrollAmount;
      const targetTab = findFirstVisibleTab(targetScroll);

      tabsContainer.scrollTo({
        left: targetTab.offsetLeft - leftArrow.clientWidth,
        behavior: "smooth",
      });
    }
  };

  leftArrow.onclick = () => scrollTabs("left");
  rightArrow.onclick = () => scrollTabs("right");

  tabsContainer.addEventListener("scroll", updateArrows);

  return { leftArrow, rightArrow };
};
