import i18n from "../../../i18n";

export const onValidate = (values) => {
  const errors = {};

  Object.keys(values).map((key) => {
    const value = values[key];
    if (!value || (Array.isArray(value) && !value.length)) {
      errors[key] = i18n.t("FieldRequired");
    }
  });

  if (values.languages?.length < 2) {
    errors.languages = i18n.t("MinLanguages");
  }

  return errors;
};
