import { allLngValue, lngDictionary } from "../..";

export const handlePluginFormConfig = ({ name, config, formik }) => {
  if (!name) return;

  if (name === "languages") {
    config.onChange = (_, value) => {
      if (value.length === 0) {
        formik.setFieldValue("default_language", "");
      }
      formik.setFieldValue(name, value);
    };
  } else if (name === "content_types") {
    config.onChange = (_, value) => {
      let sliceIndex = null;
      const lastIndex = value.length - 1;

      if (lastIndex > 0) {
        if (value[0] === allLngValue) {
          sliceIndex = 1;
        } else if (value[lastIndex] === allLngValue) {
          sliceIndex = lastIndex;
        }
      }

      formik.setFieldValue(name, sliceIndex ? value.slice(sliceIndex) : value);
    };
  } else if (name === "default_language") {
    config.options = (formik.values.languages || []).map((key) => ({
      value: key,
      label: lngDictionary.current[key],
    }));
    config.additionalDropdownClasses = "bottom-full top-auto";
  }
};
