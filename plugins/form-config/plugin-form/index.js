import { getCachedElement } from "../../../common/plugin-element-cache";
import { validDeeplFieldsCacheKey } from "../../../common/valid-fields";
import { lngDictionary } from "../../languages";

export const handlePluginFormConfig = ({ name, config, form }) => {
  if (name === "default_language") {
    config.options = (form.getValue("languages") || []).map((key) => ({
      value: key,
      label: lngDictionary.current[key],
    }));
    config.additionalDropdownClasses = "bottom-full top-auto";
  }

  if (name.includes("deepl_config")) {
    const { index, type } =
      name.match(/deepl_config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === "fields") {
      const fieldOptions = getCachedElement(validDeeplFieldsCacheKey)?.element
        ?.fieldOptions;

      const ctd = form.getValue(`deepl_config[${index}].content_type`);

      config.options = fieldOptions?.[ctd] || [];
      config.additionalHelpTextClasses = "break-normal";
    }
  }
};
