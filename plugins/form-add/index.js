import { formLng, getLanguageKey } from "../../common/translations";
import {
  addElementToCache,
  getCachedElement,
  updateDataInCache,
} from "../../common/plugin-element-cache";
import pluginInfo from "../../plugin-manifest.json";
import { createWarningElement } from "./elements/warning";
import { allLngValue } from "../languages";
import { createTabsElement } from "./elements/tabs";
import { createDeepLButton } from "./elements/deepl";

const lastLng = {};

export const handleFormFieldAdd = (
  { contentType, form, initialData, formUniqueKey },
  getPluginSettings,
  toast,
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
    return createWarningElement(contentType);
  }

  const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);

  const dropdownCacheKey = `${pluginInfo.id}-${contentType.name}-${formUniqueKey}-language-tabs`;
  let multilingualContainer = getCachedElement(dropdownCacheKey)?.element;
  let multlingualData = getCachedElement(dropdownCacheKey)?.data || {};

  multlingualData.form = form;

  if (!multilingualContainer) {
    multilingualContainer = document.createElement("div");
    multilingualContainer.classList.add("plugin-multilingual-container");

    const tabsContainer = createTabsElement(
      contentType,
      initialData,
      multlingualData,
      formUniqueKey,
      parsedSettings,
    );

    multilingualContainer.appendChild(tabsContainer);

    const deeplConfigForContentType = parsedSettings?.deepl_config?.find(
      ({ content_type }) => content_type === contentType.name,
    );

    if (parsedSettings.deepl_api_key && deeplConfigForContentType) {
      const deeplData = {
        contentType,
        initialData,
        settings: deeplConfigForContentType,
        languages: parsedSettings.languages,
        form,
        toast,
      };

      const deeplButton = createDeepLButton(deeplData, toast);
      multilingualContainer.appendChild(deeplButton);
    }

    addElementToCache(tabsContainer, dropdownCacheKey, multlingualData, () => {
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

  updateDataInCache(dropdownCacheKey, multilingualContainer);

  return multilingualContainer;
};
