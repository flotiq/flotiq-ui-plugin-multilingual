import {
  formCache,
  formLng,
  getLanguageKey,
} from "../../../common/translations";

const errorClass = "plugin-multilingual-tab__item--error";

const toggleErrorOnTab = (lng, error) => {
  const lngItem = document
    .querySelector(".plugin-multilingual-tabs")
    ?.querySelector(`.plugin-multilingual-tab__item[data-language=${lng}]`);

  if (!lngItem) return;

  if (error) {
    lngItem.classList.add(errorClass);
  } else {
    lngItem.classList.remove(errorClass);
  }
};

const hasDefaultErrors = (form) =>
  Object.keys(form.getErrors()).filter((name) => {
    console.log(name, !name.includes("__translations"));
    return !name.includes("__translations");
  })?.length;

export const handleCoFormConfig = async (
  { name, config, form, contentType, initialData, formUniqueKey },
  defaultLanguage,
) => {
  if (!contentType?.metaDefinition?.propertiesConfig?.__translations) return;

  const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);

  formCache[lngKey] = form;

  config.key = `${formUniqueKey || "new"}-${formLng[lngKey]}-${name}`;

  const defaultHasErrors = hasDefaultErrors(form);
  toggleErrorOnTab(defaultLanguage, defaultHasErrors);

  const translationFieldValue = form.getValue("__translations") || [];

  console.log(form.getErrors(), defaultHasErrors);

  translationFieldValue.forEach(({ __language }, idx) => {
    toggleErrorOnTab(
      __language,
      Object.keys(form.getErrors()).filter((name) =>
        name.includes(`__translations[${idx}]`),
      )?.length,
    );
  });

  if (!formLng[lngKey] || formLng[lngKey] === defaultLanguage) {
    return;
  }

  const translationIndex = translationFieldValue.findIndex(
    ({ __language }) => __language === formLng[lngKey],
  );

  const lngIndex =
    translationIndex > -1 ? translationIndex : translationFieldValue.length;

  const translationFieldName = `__translations[${lngIndex}]`;
  if (name.includes(translationFieldName)) return;

  const fieldName = `${translationFieldName}.${name}`;

  if (fieldName !== config.name) {
    config.name = fieldName;

    const value = translationFieldValue[lngIndex]?.[name];
    if ("checked" in config) {
      config.checked = value;
    } else {
      config.value = value;
    }

    const error = form.getError("__translations")?.[lngIndex]?.[name];
    config.error = error;
  }
};
