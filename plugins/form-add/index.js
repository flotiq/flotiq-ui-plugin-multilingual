import { allLngValue, lngDictionary } from "..";
import {
  addToTranslations,
  formLng,
  getLanguageKey,
} from "../../common/translations";
import {
  addElementToCache,
  getCachedElement,
  updateDataInCache,
} from "../../common/plugin-element-cache";
import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

const selectedClass = "plugin-multilingual-tab__item--selected";

const lastLng = {};

export const handleFormFieldAdd = (
  { contentType, formik, initialData, formUniqueKey },
  getPluginSettings,
) => {
  if (
    contentType?.nonCtdSchema ||
    !contentType?.name ||
    contentType?.internal
  ) {
    return;
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  const isMultilingual = parsedSettings?.content_types?.find((ctd) =>
    [allLngValue, contentType.name].includes(ctd),
  );

  if (!isMultilingual) return;

  if (!contentType.metaDefinition?.propertiesConfig?.__translations) {
    const warningCacheKey = `${pluginInfo.id}-${contentType.name}-no-translations-warning`;
    let warning = getCachedElement(warningCacheKey)?.element;

    if (!warning) {
      warning = document.createElement("div");
      warning.className = "plugin-multilingual-translations-warning";

      addElementToCache(warning, warningCacheKey);
    }

    warning.textContent = i18n.t("NoTranslations");

    return warning;
  }

  const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);

  const dropdownCacheKey = `${pluginInfo.id}-${contentType.name}-${formUniqueKey}-language-tabs`;
  let tabsContainer = getCachedElement(dropdownCacheKey)?.element;
  let tabsData = getCachedElement(dropdownCacheKey)?.data || {};

  tabsData.formik = formik;

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

        /**
         * This is needed to rerender all fields in form
         */
        tabsData.formik.setValues({ ...tabsData.formik.values });

        setTimeout(() => {
          if (formLng[lngKey] !== defaultLng) {
            const indexInTranlsations = (
              tabsData.formik.values.__translations || []
            ).findIndex(({ __language }) => __language === formLng[lngKey]);

            if (indexInTranlsations < 0) {
              addToTranslations(
                contentType,
                tabsData.formik,
                formLng[lngKey],
                initialData,
              );
            }
          }

          const touchedFields = Object.keys(
            tabsData.formik.errors || {},
          ).reduce(
            (acc, key) => {
              acc[key] = true;
              return acc;
            },
            { __translations: true },
          );

          tabsData.formik.setTouched(touchedFields);
        });
      };

      tabsContainer.appendChild(lngItemButton);
    }

    addElementToCache(tabsContainer, dropdownCacheKey, tabsData, () => {
      if (
        !initialData &&
        window.location.pathname.includes(`/edit/${contentType.name}/`)
      ) {
        lastLng[contentType.name] = formLng[lngKey];
      } else {
        delete lastLng[contentType.name];
      }
    });
  }

  updateDataInCache(dropdownCacheKey, tabsData);

  return tabsContainer;
};
