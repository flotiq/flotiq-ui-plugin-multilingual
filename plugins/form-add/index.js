import { formLng, getLanguageKey } from "../../common/translations";
import {
  addElementToCache,
  getCachedElement,
  updateDataInCache,
} from "../../common/plugin-element-cache";
import pluginInfo from "../../plugin-manifest.json";
import { createWarningElement } from "./elements/warning";
import { allLngValue } from "../languages";
import { createTabsWrapper } from "./elements/tabs-wrapper";
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

  const cacheKey = `${pluginInfo.id}-${contentType.name}-${formUniqueKey}-language-tabs`;
  let multilingualContainer = getCachedElement(cacheKey)?.element;
  let multlingualData = getCachedElement(cacheKey)?.data || {
    contentType,
    initialData,
    formUniqueKey,
    form,
    toast,
    settings: parsedSettings,
  };

  multlingualData.form = form;

  if (!multilingualContainer) {
    multilingualContainer = document.createElement("div");
    multilingualContainer.classList.add("plugin-multilingual-container");

    const tabsWrapper = createTabsWrapper(multlingualData);

    multilingualContainer.appendChild(tabsWrapper);

    const deeplConfigForContentType = parsedSettings?.deepl_config?.find(
      ({ content_type }) => content_type === contentType.name,
    );

    if (parsedSettings.deepl_api_key && deeplConfigForContentType) {
      const deeplButton = createDeepLButton(
        multlingualData,
        deeplConfigForContentType,
        toast,
      );
      multilingualContainer.appendChild(deeplButton);
    }

    addElementToCache(multilingualContainer, cacheKey, multlingualData, () => {
      if (
        !initialData &&
        window.location.pathname.includes(`/edit/${contentType.name}/`)
      ) {
        lastLng[contentType.name] = formLng[lngKey];
      } else {
        delete lastLng[contentType.name];
      }
      tabsWrapper.dispatchEvent(new Event("flotiq.detached"));
    });

    multilingualContainer.addEventListener("flotiq.attached", () => {
      const parentElement = multilingualContainer.parentElement;
      parentElement.className = "plugin-multilingual-sticky-wrapper";

      const form = parentElement.parentElement;
      if (form) {
        form.style.position = "relative";
      }

      tabsWrapper.dispatchEvent(new Event("flotiq.attached"));
    });
  }

  updateDataInCache(cacheKey, multilingualContainer);

  return multilingualContainer;
};
