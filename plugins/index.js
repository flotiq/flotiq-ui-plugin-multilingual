import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";

import cssString from "inline:./styles/style.css";
import { handleManageSchema } from "./manage";
import { handleFormFieldConfig } from "./form-config";
import { handleFormFieldAdd } from "./form-add";
import { handleRemovedEvent } from "./plugin-removed";
import { handleFormFieldListenersAdd } from "./field-listeners";

import i18n from "../i18n";
import languages from "@cospired/i18n-iso-languages";
import enLocaleLng from "@cospired/i18n-iso-languages/langs/en.json";
import plLocaleLng from "@cospired/i18n-iso-languages/langs/pl.json";
import {
  formikCache,
  getLanguageKey,
  updateTranlsations,
} from "../common/translations";

enLocaleLng.languages.cnr = 'Montenegrin';
plLocaleLng.languages.cnr = 'czarnogórski';

languages.registerLocale(enLocaleLng);
languages.registerLocale(plLocaleLng);

export const lngDictionary = { current: {} };

export const allLngValue = "--all--";

registerFn(pluginInfo, (handler, client, globals) => {
  /**
   * Add plugin styles to the head of the document
   */
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  const language = globals.getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  lngDictionary.current = languages.getNames(language);

  lngDictionary.current["default"] = i18n.t("Default");

  handler.on("flotiq.language::changed", ({ language }) => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
      lngDictionary.current = languages.getNames(language);
    }
  });

  handler.on("flotiq.form.field::config", (data) =>
    handleFormFieldConfig(data, globals.getPluginSettings),
  );

  handler.on("flotiq.form::add", (data) =>
    handleFormFieldAdd(data, globals.getPluginSettings),
  );

  handler.on("flotiq.form.field.listeners::add", (data) =>
    handleFormFieldListenersAdd(data),
  );

  handler.on("flotiq.plugins.manage::form-schema", (data) =>
    handleManageSchema(data, client, globals),
  );

  handler.on("flotiq.plugin::removed", () =>
    handleRemovedEvent(client, globals),
  );

  handler.on(
    "flotiq-multilingual.translation::update",
    ({ contentType, initialData, formUniqueKey, language, values }) => {
      const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);
      updateTranlsations(
        language,
        values,
        contentType,
        formikCache[lngKey],
        initialData,
      );
    },
  );
});
