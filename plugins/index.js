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
  formCache,
  getLanguageKey,
  updateTranlsations,
} from "../common/translations";

enLocaleLng.languages.cnr = "Montenegrin";
plLocaleLng.languages.cnr = "czarnogórski";

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

    const googleFontsApiLink = document.createElement("link");
    const googleFontsStaticLink = document.createElement("link");
    const googleFontsLink = document.createElement("link");

    googleFontsApiLink.href = "https://fonts.googleapis.com";
    googleFontsApiLink.rel = "preconnect";
    googleFontsStaticLink.href = "https://fonts.gstatic.com";
    googleFontsStaticLink.rel = "preconnect";
    googleFontsStaticLink.crossOrigin = "anonymous";

    googleFontsLink.href =
      "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap";
    googleFontsLink.rel = "stylesheet";

    document.head.appendChild(style);
    document.head.appendChild(googleFontsApiLink);
    document.head.appendChild(googleFontsStaticLink);
    document.head.appendChild(googleFontsLink);
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
        formCache[lngKey],
        initialData,
      );
    },
  );
});
