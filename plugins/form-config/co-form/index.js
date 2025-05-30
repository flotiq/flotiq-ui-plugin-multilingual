import {
  formikCache,
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

const hasDefaultErrors = (formik) =>
  Object.keys(formik.errors).filter((name) => !name.includes("__translations"))
    ?.length;

export const handleCoFormConfig = async (
  { name, config, formik, contentType, initialData, formUniqueKey },
  defaultLanguage,
) => {
  if (!contentType?.metaDefinition?.propertiesConfig?.__translations) return;

  const lngKey = getLanguageKey(contentType, initialData, formUniqueKey);

  formikCache[lngKey] = formik;

  config.key = `${formUniqueKey || "new"}-${formLng[lngKey]}-${name}`;

  const defaultHasErrors = hasDefaultErrors(formik);
  toggleErrorOnTab(defaultLanguage, defaultHasErrors);

  (formik.values.__translations || []).forEach(({ __language }, idx) => {
    toggleErrorOnTab(
      __language,
      /**
       * @TODO
       * After refactoring forms remove the line comaptibile with formik,
       * !!formik.errors?.__translations?.[idx]
       */
      !!formik.errors?.__translations?.[idx] ||
        Object.keys(formik.errors).filter((name) =>
          name.includes(`__translations[${idx}]`),
        )?.length,
    );
  });

  if (!formLng[lngKey] || formLng[lngKey] === defaultLanguage) {
    return;
  }

  const translationIndex = formik.values.__translations?.findIndex(
    ({ __language }) => __language === formLng[lngKey],
  );

  const lngIndex =
    translationIndex > -1
      ? translationIndex
      : formik.values.__translations.length;

  const translationFieldName = `__translations[${lngIndex}]`;
  if (name.includes(translationFieldName)) return;

  const fieldName = `${translationFieldName}.${name}`;

  if (fieldName !== config.name) {
    config.name = fieldName;

    const value = formik.values.__translations?.[lngIndex]?.[name];
    if ("checked" in config) {
      config.checked = value;
    } else {
      config.value = value;
    }

    const error = formik.errors.__translations?.[lngIndex]?.[name];
    config.error = error;
  }
};
