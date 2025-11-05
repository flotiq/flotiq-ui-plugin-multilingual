import i18n from "../../../i18n";

export const getValidator = (fieldKeys) => {
  return (values) => {
    const errors = {};

    ["content_types", "languages", "defaultLanguage"].map((key) => {
      const value = values[key];
      if (!value || (Array.isArray(value) && !value.length)) {
        errors[key] = i18n.t("FieldRequired");
      }
    });

    if (values.languages?.length < 2) {
      errors.languages = i18n.t("MinLanguages");
    }

    values.deepl_config?.forEach((ctdConfig, index) => {
      ["content_type", "fields"].map((key) => {
        const value = ctdConfig[key];
        if (!value || (Array.isArray(value) && !value.length)) {
          errors[`deepl_config[${index}].${key}`] = i18n.t("FieldRequired");
        }
      });

      (ctdConfig.fields || []).map((field) => {
        if (!(fieldKeys[ctdConfig.content_type] || []).includes(field)) {
          errors[`deepl_config[${index}].fields`] = i18n.t("WrongField");
        }
      });
    });

    return errors;
  };
};
