import { lngDictionary } from "../..";

export const handlePluginFormConfig = ({ name, config, form }) => {
  if (name === "default_language") {
    config.options = (form.getValue("languages") || []).map((key) => ({
      value: key,
      label: lngDictionary.current[key],
    }));
    config.additionalDropdownClasses = "bottom-full top-auto";
  }
};
