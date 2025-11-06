import pluginInfo from "../../../plugin-manifest.json";
import { getCachedElement } from "../../../common/plugin-element-cache";
import { createTabsArrowsElement } from "./tabs-arrows";
import { createTabs } from "./tabs";

export const createTabsWrapper = (tabsData) => {
  const cacheKey = `${pluginInfo.id}-${tabsData.contentType.name}-${tabsData.ormUniqueKey}-language-tabs`;
  let wrapper = getCachedElement(cacheKey)?.element;

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "plugin-multilingual-tabs-wrapper";

    const { tabsContainer, tabsInner } = createTabs(tabsData);

    const { leftArrow, rightArrow } = createTabsArrowsElement(
      tabsContainer,
      tabsInner,
    );

    tabsContainer.appendChild(tabsInner);
    wrapper.appendChild(leftArrow);
    wrapper.appendChild(tabsContainer);
    wrapper.appendChild(rightArrow);
  }

  return wrapper;
};
