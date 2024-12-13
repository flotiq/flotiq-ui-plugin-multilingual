import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

const selectedClass = "plugin-multilangual-tab__item--selected";

export const formLng = {
  current: null,
};

const addToTranslations = (contentTypeSettings, formik, lngIndex) => {
  const defaultObject = contentTypeSettings.fields.reduce(
    (fields, currentFieldKey) => {
      fields[currentFieldKey] = formik.values[currentFieldKey];
      return fields;
    },
    {},
  );

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

  const contentTypeSettings = parsedSettings?.config?.find(
    ({ content_type }) => content_type === contentType?.name,
  );

  if (!contentTypeSettings) return;

  if (!contentType.metaDefinition?.propertiesConfig?.__translations) {
    const warningCacheKey = `${pluginInfo.id}-no-translations-warning`;
    let warning = getCachedElement(warningCacheKey)?.element;

    if (!warning) {
      warning = document.createElement("div");
      warning.className = "plugin-multilangual-translations-warning";

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
    tabsContainer.className = "plugin-multilangual-tabs";

    const defaultLng = contentTypeSettings.default_language;
    formLng.current = defaultLng;

    for (const lng of contentTypeSettings.languages) {
      const lngItemButton = document.createElement("button");
      lngItemButton.className = "plugin-multilangual-tab__item";
      lngItemButton["data-language"] = lng;
      lngItemButton.innerText = lng;
      lngItemButton.type = "button";

      if (lng === defaultLng) {
        lngItemButton.classList.toggle(selectedClass);
        lngItemButton.classList.toggle(
          "plugin-multilangual-tab__item--default",
        );
      }

      lngItemButton.onclick = (event) => {
        formLng.current = lng;

        const slectedTab = tabsContainer.querySelector(`.${selectedClass}`);
        if (slectedTab) slectedTab.classList.toggle(selectedClass);

        event.target.classList.toggle(selectedClass);

        setTimeout(() => {
          if (formLng.current !== defaultLng) {
            const indexInTranlsations = Object.values(
              tabsData.formik.values.__translations,
            ).findIndex(({ __language }) => __language === formLng.current);

            if (indexInTranlsations < 0) {
              addToTranslations(
                contentTypeSettings,
                tabsData.formik,
                tabsData.formik.values.__translations.length,
              );
            }
          }

          tabsData.formik.setFieldTouched(`__translations`, true);
        });
      };

      tabsContainer.appendChild(lngItemButton);
    }
  }

  addElementToCache(tabsContainer, dropdownCacheKey, tabsData);

  return tabsContainer;
};
