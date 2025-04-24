export const formLng = {};
export const formikCache = {};

export const getLanguageKey = (contentType, contentObject, formUniqueKey) =>
  `${contentType.name}-${contentObject?.id || "new"}-${formUniqueKey}`;

export const addToTranslations = (
  contentType,
  formik,
  language,
  initialData,
  translations = {},
) => {
  const lngIndex = formik.values.__translations?.length || 0;
  const order = contentType.metaDefinition.order.filter(
    (key) => !["__translations", "__language"].includes(key),
  );

  const defaultObject = order.reduce((fields, currentFieldKey) => {
    fields[currentFieldKey] = formik.values[currentFieldKey];
    return fields;
  }, {});

  const newTranslation = {
    ...defaultObject,
    ...translations,
    __language: language,
  };

  const fieldName = `__translations.[${lngIndex}]`;
  formik.setFieldValue(fieldName, newTranslation);

  window.FlotiqPlugins.run(`flotiq-multilingual.translation::changed`, {
    fieldName,
    newTranslation,
    contentType,
    initialData,
    language,
  });
};

export const updateTranlsations = (
  language,
  values,
  contentType,
  formik,
  initialData,
) => {
  const languageIndex = (formik.values.__translations || []).findIndex(
    ({ __language }) => __language === language,
  );

  if (languageIndex > -1) {
    const newTranslation = {
      ...formik.values.__translations[languageIndex],
      ...values,
    };

    const fieldName = `__translations.[${languageIndex}]`;
    formik.setFieldValue(fieldName, newTranslation);

    window.FlotiqPlugins.run(`flotiq-multilingual.translation::changed`, {
      fieldName,
      newTranslation,
      contentType,
      initialData,
      language,
    });
  } else {
    addToTranslations(contentType, formik, language, initialData, values);
  }
};
