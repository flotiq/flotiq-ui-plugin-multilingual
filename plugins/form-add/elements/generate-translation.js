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
    throw new Error("Translation failed");
  }
};

/**
 * Use the DeepL API to translate the content of the form fields
 * @param {*} param0
 * @param toast
 */

export const generateTranslation = async (
  { settings, form, languages, contentType, initialData },
  toast,
) => {
  const fieldValues = {};
  for (const field of settings.fields) {
    fieldValues[field] = form.getValue(field);
  }

  /**
   * For each language that the plugin is configured to translate to,
   * get the translation of each language
   * and send event to multilingual to update translations
   */
  const languagesToTranslate = languages.filter(
    (lng) => lng !== settings.default_language,
  );

  for (const language of languagesToTranslate) {
    const values = await getTranslations(
      settings.api_key,
      fieldValues,
      language,
    );

    updateTranslations(language, values, contentType, form, initialData);
  }
  toast.success(i18n.t("Success"), { duration: 5000 });
};
