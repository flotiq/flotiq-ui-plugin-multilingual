import { allLngValue, lngDictionary } from "..";
import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

const selectedClass = "plugin-multilingual-tab__item--selected";

export const formLng = {
  current: null,
};

const addToTranslations = (contentType, formik, lngIndex) => {
  const order = contentType.metaDefinition.order.filter(
    (key) => !["__translations", "__language"].includes(key),
  );

  const defaultObject = order.reduce((fields, currentFieldKey) => {
    fields[currentFieldKey] = formik.values[currentFieldKey];
    return fields;
  }, {});

  formik.setFieldValue(`__translations.[${lngIndex}]`, {
    ...defaultObject,
    __language: formLng.current,
  });
};

export const handleFormFieldAdd = (
  { contentType, formik },
  getPluginSettings,
) => {
  if (contentType?.nonCtdSchema) {
    return;
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  const isMultilingual = parsedSettings?.content_types?.find((ctd) =>
    [allLngValue, contentType?.name].includes(ctd),
  );

  if (!isMultilingual) return;

  if (!contentType.metaDefinition?.propertiesConfig?.__translations) {
    const warningCacheKey = `${pluginInfo.id}-no-translations-warning`;
    let warning = getCachedElement(warningCacheKey)?.element;

    if (!warning) {
      warning = document.createElement("div");
      warning.className = "plugin-multilingual-translations-warning";

      addElementToCache(warning, warningCacheKey);
    }

    warning.textContent = i18n.t("NoTranslations");

    return warning;
  }

  const dropdownCacheKey = `${pluginInfo.id}-language-tabs`;
  let tabsContainer = getCachedElement(dropdownCacheKey)?.element;
  let tabsData = getCachedElement(dropdownCacheKey)?.data || {};

  tabsData.formik = formik;

  if (!tabsContainer) {
    tabsContainer = document.createElement("div");
    tabsContainer.className = "plugin-multilingual-tabs";

    const defaultLng = parsedSettings.default_language;
    formLng.current = defaultLng;

    for (const lng of parsedSettings.languages) {
      const lngItemButton = document.createElement("button");
      lngItemButton.className = "plugin-multilingual-tab__item";
      lngItemButton.setAttribute("data-language", lng);
      lngItemButton.innerText = lngDictionary.current[lng];
      lngItemButton.type = "button";

      if (lng === defaultLng) {
        lngItemButton.classList.toggle(selectedClass);
        lngItemButton.classList.toggle(
          "plugin-multilingual-tab__item--default",
        );
      }

      lngItemButton.onclick = (event) => {
        formLng.current = lng;

        const slectedTab = tabsContainer.querySelector(`.${selectedClass}`);
        if (slectedTab) slectedTab.classList.toggle(selectedClass);

        event.target.classList.toggle(selectedClass);

        setTimeout(() => {
          if (formLng.current !== defaultLng) {
            const indexInTranlsations = (
              tabsData.formik.values.__translations || []
            ).findIndex(({ __language }) => __language === formLng.current);

            if (indexInTranlsations < 0) {
              addToTranslations(
                contentType,
                tabsData.formik,
                tabsData.formik.values.__translations?.length || 0,
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
  }

  addElementToCache(tabsContainer, dropdownCacheKey, tabsData);

  return tabsContainer;
};
