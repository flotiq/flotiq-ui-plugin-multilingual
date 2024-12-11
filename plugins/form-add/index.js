import {
  addElementToCache,
  getCachedElement,
} from "../../common/plugin-element-cache";
import pluginInfo from "../../plugin-manifest.json";

const selectedClass = "plugin-multilangual-tab__item--selected";

export const formLng = {
  current: null,
};

const addToTranslations = (contentTypeSettings, formik, lngIndex) => {
  const defaultObject = contentTypeSettings.fields.reduce(
    (fields, currentFieldKey) => {
      console.log(currentFieldKey, formik.values[currentFieldKey]);
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
  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  const contentTypeSettings = parsedSettings?.config?.find(
    ({ content_type }) => content_type === contentType?.name,
  );

  if (!contentTypeSettings) return;

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
      lngItemButton.innerText = lng;
      lngItemButton.type = "button";

      if (lng === defaultLng) {
        lngItemButton.classList.toggle(selectedClass);
      }

      lngItemButton.onclick = async (event) => {
        formLng.current = lng;

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

        const slectedTab = document.querySelector(`.${selectedClass}`);
        if (slectedTab) slectedTab.classList.toggle(selectedClass);

        event.target.classList.toggle(selectedClass);
      };

      tabsContainer.appendChild(lngItemButton);
    }
  }

  addElementToCache(tabsContainer, dropdownCacheKey, tabsData);

  return tabsContainer;
};
