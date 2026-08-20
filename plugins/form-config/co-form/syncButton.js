import pluginInfo from "../../../plugin-manifest.json";
import syncIcon from "inline:../../../images/sync-icon.svg";
import i18n from "../../../i18n";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";

export const createSyncButton = (
  form,
  name,
  defaultName,
  contentTypeName,
  formUniqueKey,
) => {
  const cachePrefix = `${pluginInfo.id}-${contentTypeName}-${formUniqueKey}-${name}`;

  const syncButtonCacheKey = `${cachePrefix}-sync-field`;
  let syncButton = getCachedElement(syncButtonCacheKey)?.element;
  let syncButtonData = getCachedElement(syncButtonCacheKey)?.data || {};

  syncButtonData.form = form;
  syncButtonData.name = name;
  syncButtonData.defaultName = defaultName;

  if (!syncButton) {
    syncButton = document.createElement("button");
    syncButton.type = "button";
    syncButton.className = "plugin-multilingual-sync-button";
    syncButton.innerHTML = `${syncIcon} ${i18n.t("SyncValues")}`;

    syncButton.onclick = () => {
      const form = syncButtonData.form;
      const defaultValue = form.getValue(syncButtonData.defaultName);
      form.setFieldValue(syncButtonData.name, defaultValue);
    };

    addElementToCache(syncButton, syncButtonCacheKey, syncButtonData);
  }

  return syncButton;
};
