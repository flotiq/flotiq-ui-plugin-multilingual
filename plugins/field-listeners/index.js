import pluginInfo from "../../plugin-manifest.json";

export const handleFormFieldListenersAdd = ({ contentType, form, name }) => {
  if (name && contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    if (name === "languages") {
      return {
        onChange: ({ value }) => {
          if (value.length === 0) {
            form.setFieldValue("default_language", "");
          } else {
            form.rerenderForm();
          }
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
    } else if (name.startsWith("deepl_config")) {
      const { index, type } =
        name.match(/deepl_config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

      if (index == null || !type) return;

      if (type === "content_type") {
        return {
          onChange: () => {
            form.setFieldValue(`deepl_config[${index}].fields`, []);
          },
        };
      }
    }
  }
};
