export const formLng = {};
export const formCache = {};

export const getLanguageKey = (contentType, contentObject, formUniqueKey) =>
  `${contentType.name}-${contentObject?.id || "new"}-${formUniqueKey}`;

export const addToTranslations = (
  contentType,
  form,
  language,
  initialData,
  translations = {},
) => {
  const values = form.getValues();

  const lngIndex = values.__translations?.length || 0;
  const order = contentType.metaDefinition.order.filter(
    (key) => !["__translations", "__language"].includes(key),
  );

  const defaultObject = order.reduce((fields, currentFieldKey) => {
    fields[currentFieldKey] = values[currentFieldKey];
    return fields;
  }, {});

  const newTranslation = {
    ...defaultObject,
    ...translations,
    __language: language,
  };

  const fieldName = `__translations.[${lngIndex}]`;
  form.setFieldValue(fieldName, newTranslation);

  window.FlotiqPlugins.run(`flotiq-multilingual.translation::changed`, {
    fieldName,
    newTranslation,
    contentType,
    initialData,
    language,
  });
};

export const updateTranslations = (
  language,
  values,
  contentType,
  form,
  initialData,
) => {
  const formValues = form.getValues();

  const languageIndex = (formValues.__translations || []).findIndex(
    ({ __language }) => __language === language,
  );

  if (languageIndex > -1) {
    const newTranslation = {
      ...formValues.__translations[languageIndex],
      ...values,
    };

    const fieldName = `__translations.[${languageIndex}]`;
    form.setFieldValue(fieldName, newTranslation);

    window.FlotiqPlugins.run(`flotiq-multilingual.translation::changed`, {
      fieldName,
      newTranslation,
      contentType,
      initialData,
      language,
    });
  } else {
    addToTranslations(contentType, form, language, initialData, values);
  }
};
