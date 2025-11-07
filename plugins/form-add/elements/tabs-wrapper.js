import pluginInfo from "../../../plugin-manifest.json";
import { getCachedElement } from "../../../common/plugin-element-cache";
import { createTabsArrowsElement } from "./tabs-arrows";
import { createTabs } from "./tabs";
import { getLanguageKey } from "../../../common/translations";

export const createTabsWrapper = (tabsData) => {
  const cacheKey = `${pluginInfo.id}-${tabsData.contentType.name}-${tabsData.ormUniqueKey}-language-tabs`;
  let wrapper = getCachedElement(cacheKey)?.element;

  const lngKey = getLanguageKey(
    tabsData.contentType,
    tabsData.initialData,
    tabsData.formUniqueKey,
  );

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "plugin-multilingual-tabs-wrapper";

    const { tabsContainer, tabsInner } = createTabs(tabsData, lngKey);
    const { leftArrow, rightArrow, updateArrows } =
      createTabsArrowsElement(tabsContainer);

    tabsContainer.appendChild(tabsInner);
    wrapper.appendChild(leftArrow);
    wrapper.appendChild(tabsContainer);
    wrapper.appendChild(rightArrow);

    wrapper.addEventListener("flotiq.attached", () => {
      updateArrows();
    });

    window.addEventListener("resize", () => {
      updateArrows();
    });
  }

  return wrapper;
};
