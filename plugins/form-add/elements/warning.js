import pluginInfo from "../../../plugin-manifest.json";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import i18n from "../../../i18n";

export const createWarningElement = (contentType) => {
  const warningCacheKey = `${pluginInfo.id}-${contentType.name}-no-translations-warning`;
  let warning = getCachedElement(warningCacheKey)?.element;

  if (!warning) {
    warning = document.createElement("div");
    warning.className = "plugin-multilingual-translations-warning";

    addElementToCache(warning, warningCacheKey);
  }

  warning.textContent = i18n.t("NoTranslations");

  return warning;
};
