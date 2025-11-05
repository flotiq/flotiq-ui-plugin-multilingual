import pluginInfo from "../../../plugin-manifest.json";
import { getCachedElement } from "../../../common/plugin-element-cache";
import {
  addToTranslations,
  formLng,
  getLanguageKey,
} from "../../../common/translations";
import { lngDictionary } from "../../languages";

const selectedClass = "plugin-multilingual-tab__item--selected";

const lastLng = {};

export const createTabsElement = (
  contentType,
  initialData,
  tabsData,
  formUniqueKey,
  parsedSettings,
) => {
  const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);
  const cacheKey = `${pluginInfo.id}-${contentType.name}-${formUniqueKey}-language-tabs`;

  let tabsContainer = getCachedElement(cacheKey)?.element;

  if (!tabsContainer) {
    tabsContainer = document.createElement("div");
    tabsContainer.className = "plugin-multilingual-tabs";

    const defaultLng = parsedSettings.default_language;
    formLng[lngKey] = lastLng[contentType.name] || defaultLng;

    for (const lng of parsedSettings.languages) {
      const lngItemButton = document.createElement("button");
      lngItemButton.className = "plugin-multilingual-tab__item";
      lngItemButton.setAttribute("data-language", lng);
      lngItemButton.innerText = lngDictionary.current[lng];
      lngItemButton.type = "button";

      if (lng === defaultLng) {
        lngItemButton.classList.toggle(
          "plugin-multilingual-tab__item--default-item",
        );
      }

      if (lng === formLng[lngKey]) {
        lngItemButton.classList.toggle(selectedClass);
      }

      lngItemButton.onclick = (event) => {
        formLng[lngKey] = lng;

        const slectedTab = tabsContainer.querySelector(`.${selectedClass}`);
        if (slectedTab) slectedTab.classList.toggle(selectedClass);

        event.target.classList.toggle(selectedClass);

        setTimeout(() => {
          if (formLng[lngKey] !== defaultLng) {
            const indexInTranlsations = (
              tabsData.form.getValues().__translations || []
            ).findIndex(({ __language }) => __language === formLng[lngKey]);

            if (indexInTranlsations < 0) {
              addToTranslations(
                contentType,
                tabsData.form,
                formLng[lngKey],
                initialData,
              );
            }
          }

          const touchedFields = Object.keys(
            tabsData.form.getErrors() || {},
          ).reduce(
            (acc, key) => {
              acc[key] = true;
              return acc;
            },
            { __translations: true },
          );

          tabsData.form.setTouched(touchedFields);

          tabsData.form.rerenderForm();
        });
      };

      tabsContainer.appendChild(lngItemButton);
    }

    return tabsContainer;
  }
};
