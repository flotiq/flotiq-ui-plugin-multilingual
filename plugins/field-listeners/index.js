import pluginInfo from "../../plugin-manifest.json";

export const handleFormFieldListenersAdd = ({ contentType, form, name }) => {
  if (name && contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    if (name === "languages") {
      return {
        onChange: ({ value }) => {
          if (value.length === 0) {
            form.setFieldValue("default_language", "");
          }
          form.setFieldValue(name, value);
        },
      };
    } else if (name === "content_types") {
      return {
        onChange: ({ value }) => {
          let sliceIndex = null;
          const lastIndex = value.length - 1;

          if (lastIndex > 0) {
            if (value[0] === "--all--") {
              sliceIndex = 1;
            } else if (value[lastIndex] === "--all--") {
              sliceIndex = lastIndex;
            }
          }

          form.setFieldValue(
            name,
            sliceIndex ? value.slice(sliceIndex) : value,
          );
        },
      };
    }
  }
};
