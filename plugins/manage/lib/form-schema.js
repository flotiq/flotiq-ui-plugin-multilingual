import { lngDictionary } from "../..";
import i18n from "../../../i18n";
import pluginInfo from "../../../plugin-manifest.json";

export const getSchema = (contentTypes) => {
  const countryOptions = Object.keys(lngDictionary.current).map((key) => ({
    value: key,
    label: lngDictionary.current[key],
  }));

  return {
    id: pluginInfo.id,
    name: pluginInfo.id,
    label: pluginInfo.name,
    internal: false,
    workflowId: "generic",
    schemaDefinition: {
      type: "object",
      allOf: [
        {
          $ref: "#/components/schemas/AbstractContentTypeSchemaDefinition",
        },
        {
          type: "object",
          properties: {
            languages: {
              type: "array",
              items: {
                type: "string",
              },
              minLength: 1,
            },
            default_language: {
              type: "string",
              minLength: 1,
            },
            content_types: {
              type: "array",
              items: {
                type: "string",
              },
              minLength: 1,
            },
          },
        },
      ],
      required: ["default_language", "languages", "content_types"],
      additionalProperties: false,
    },
    metaDefinition: {
      order: ["content_types", "languages", "default_language"],
      propertiesConfig: {
        languages: {
          label: i18n.t("Languages"),
          unique: false,
          helpText: "",
          multiple: true,
          inputType: "select",
          useOptionsWithLabels: true,
          optionsWithLabels: countryOptions,
        },
        default_language: {
          label: i18n.t("DefaultLanguage"),
          unique: false,
          helpText: "",
          isMultiple: false,
          inputType: "select",
          options: [],
        },
        content_types: {
          label: i18n.t("ContentTypes"),
          unique: false,
          helpText: "",
          multiple: true,
          inputType: "select",
          optionsWithLabels: contentTypes,
          useOptionsWithLabels: true,
        },
      },
    },
  };
};
