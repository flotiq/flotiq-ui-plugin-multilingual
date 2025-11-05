import i18n from "../../../i18n";
import { generateTranslation } from "./generate-translation";

import deeplIcon from "inline:../../../images/deepl_icon.svg";

export const createDeepLButton = (data, toast) => {
  const deeplButton = document.createElement("button");
  deeplButton.className = "plugin-multilingual__deepl-button";
  deeplButton.type = "button";
  deeplButton.innerHTML = `${deeplIcon} ${i18n.t("Translate")}`;

  deeplButton.onclick = () => {
    deeplButton.disabled = true;
    generateTranslation(data, toast)
      .catch((error) => {
        console.error("Error translating content:", error);
        toast.error(i18n.t("TranslationError"), { duration: 5000 });
      })
      .finally(() => {
        deeplButton.disabled = false;
      });
  };
  return deeplButton;
};
