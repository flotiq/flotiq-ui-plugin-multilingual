import i18n from "../../../i18n";
import { generateTranslation } from "./generate-translation";

import deeplIcon from "inline:../../../images/deepl_icon.svg";

export const createDeepLButton = (data, deepLConfig, toast) => {
  const deeplButton = document.createElement("button");
  deeplButton.className = "plugin-multilingual__deepl-button";
  deeplButton.type = "button";
  deeplButton.innerHTML = `${deeplIcon} ${i18n.t("Translate")}`;

  deeplButton.onclick = () => {
    deeplButton.disabled = true;
    generateTranslation(data, deepLConfig, toast).then(() => {
      deeplButton.disabled = false;
    });
  };
  return deeplButton;
};
