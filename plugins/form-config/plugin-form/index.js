import { lngDictionary } from "../..";

export const handlePluginFormConfig = ({ name, config, formik }) => {
  if (name === "default_language") {
    config.options = (formik.values.languages || []).map((key) => ({
      value: key,
      label: lngDictionary.current[key],
    }));
    config.additionalDropdownClasses = "bottom-full top-auto";
  }
};
