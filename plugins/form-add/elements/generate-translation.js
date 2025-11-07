import i18n from "i18next";
import { updateTranslations } from "../../../common/translations";

/**
 * Helper function to translate content using the DeepL API
 * @param apiKey
 * @param {*} content
 * @param {*} targetLang
 * @returns
 */
const getTranslations = async (apiKey, fieldValues, targetLang) => {
  const url = `https://deepl.flotiq.com/`;

  const values = Object.values(fieldValues).map((value) =>
    typeof value !== "string" ? JSON.stringify(value) : value,
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: values,
        target_lang: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error message: ${await response.text()}, status: ${response.status}`,
      );
    }

    const data = await response.json();

    return Object.keys(fieldValues).reduce((acc, field, index) => {
      acc[field] = data.translations[index].text;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error translating content:", error);
    throw new Error(error);
  }
};

/**
 * Use the DeepL API to translate the content of the form fields
 * @param {*} param0
 * @param toast
 */

export const generateTranslation = async (
  { settings, form, contentType, initialData },
  deepLConfig,
  toast,
) => {
  const fieldValues = {};
  for (const field of deepLConfig.fields) {
    fieldValues[field] = form.getValue(field);
  }

  /**
   * For each language that the plugin is configured to translate to,
   * get the translation of each language
   * and send event to multilingual to update translations
   */
  const languagesToTranslate = settings.languages.filter(
    (lng) => lng !== settings.default_language,
  );

  const errors = [];
  const notSupportedLanguages = [];
  const translatedLanguages = [];

  for (const language of languagesToTranslate) {
    let values;
    try {
      values = await getTranslations(
        settings.deepl_api_key,
        fieldValues,
        language,
      );
      translatedLanguages.push(language);
    } catch (error) {
      if (error.message?.includes("not supported")) {
        notSupportedLanguages.push(language);
      } else {
        errors.push(
          i18n.t("TranslateError", { language, error: error.message }),
        );
      }
    }

    if (values) {
      updateTranslations(language, values, contentType, form, initialData);
    }
  }

  if (notSupportedLanguages.length > 0) {
    toast.error(
      i18n.t("LanguagesNotSupported", {
        languages: notSupportedLanguages.join(", "),
      }),
      { duration: 10000 },
    );
  }

  if (errors.length > 0) {
    toast.error(errors.join("\n"), { duration: 10000 });
    return;
  }

  toast.success(
    i18n.t("Translated", { languages: translatedLanguages.join(", ") }),
    { duration: 5000 },
  );
};
