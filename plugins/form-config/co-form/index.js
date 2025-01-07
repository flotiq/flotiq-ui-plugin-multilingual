import { formLng } from "../../form-add";

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
  Object.keys(formik.errors).filter((name) => name !== "__translations")
    ?.length && formik.touched?.__translations;

export const handleCoFormConfig = async (
  { name, config, formik, contentType, loadedVersion },
  defaultLanguage,
) => {
  if (!contentType.metaDefinition?.propertiesConfig?.__translations) return;

  config.key = `${loadedVersion || "new"}-${formLng.current}-${name}`;

  const defaultHasErrors = hasDefaultErrors(formik);
  toggleErrorOnTab(defaultLanguage, defaultHasErrors);

  (formik.values.__translations || []).forEach(({ __language }, idx) => {
    toggleErrorOnTab(__language, !!formik.errors?.__translations?.[idx]);
  });

  if (!formLng.current || formLng.current === defaultLanguage) {
    return;
  }

  const translationIndex = formik.values.__translations?.findIndex(
    ({ __language }) => __language === formLng.current,
  );

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

    const error = formik.errors.__translations?.[lngIndex]?.[name];
    config.error = error;
  }
};
