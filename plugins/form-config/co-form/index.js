import { formLng } from "../../form-add";

let fieldDictionary = null;

export const handleCoFormConfig = async (
  { name, config, formik, contentType },
  contentTypeSettings,
) => {
  if (!contentType.metaDefinition?.propertiesConfig?.__translations) return;

  config.key = `${formLng.current}-${name}`;

  if (
    !formLng.current ||
    formLng.current === contentTypeSettings.default_language
  ) {
    return;
  }

  if (!fieldDictionary) {
    fieldDictionary = contentTypeSettings.fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
  }

  const isInTranlsations = fieldDictionary[name];

  if (!isInTranlsations) {
    const { listName } = name.match(/(?<listName>\w+)\[(\d+)\]/)?.groups || {};

    if (listName) {
      const listInTranlsation = fieldDictionary[listName];
      if (listInTranlsation) return;
    }

    config.disabled = true;
    return;
  }

  const translationIndex = Object.values(
    formik.values.__translations,
  ).findIndex(({ __language }) => __language === formLng.current);

  const lngIndex =
    translationIndex > -1
      ? translationIndex
      : formik.values.__translations.length;

  const fieldName = `__translations.[${lngIndex}].${name}`;

  if (fieldName !== config.name) {
    config.name = fieldName;

    const value = formik.values.__translations?.[lngIndex]?.[name];

    if ("checked" in config) {
      config.checked = value;
    } else {
      config.value = value;
    }
  }
};
