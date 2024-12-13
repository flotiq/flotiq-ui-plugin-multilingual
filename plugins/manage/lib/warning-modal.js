import pluginInfo from "../../../plugin-manifest.json";
import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import i18n from "../../../i18n";

export const showWarningModal = (types, openModal) => {
  const modalContentCacheKey = `${pluginInfo.id}-remove-ctd-warning`;
  let modalContent = getCachedElement(modalContentCacheKey)?.element;

  if (!modalContent) {
    modalContent = document.createElement("div");
    modalContent.className = "plugin-multilangual-remove-ctd-warning";

    modalContent.innerHTML = /* html */ `
        <h3 class="plugin-multilangual-remove-ctd-warning__heading"></h3>
        <p class="plugin-multilangual-remove-ctd-warning__content"></p>
        `;

    addElementToCache(modalContent, modalContentCacheKey);
  }

  const heading = modalContent.querySelector(
    ".plugin-multilangual-remove-ctd-warning__heading",
  );
  heading.textContent = i18n.t("DeleteTranslations.Title");

  const content = modalContent.querySelector(
    ".plugin-multilangual-remove-ctd-warning__content",
  );

  content.innerHTML = i18n.t("DeleteTranslations.Content", {
    types,
  });

  return openModal({
    size: "lg",
    content: modalContent,
    hideClose: true,
    buttons: [
      {
        key: "remove",
        label: i18n.t("DeleteTranslations.Remove"),
        color: "red",
        result: true,
      },
      {
        key: "keep",
        label: i18n.t("DeleteTranslations.Keep"),
        color: "blueBordered",
        result: false,
      },
    ],
  });
};
