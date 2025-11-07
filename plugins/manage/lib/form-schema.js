import i18n from "../../../i18n";
import pluginInfo from "../../../plugin-manifest.json";
import { lngDictionary } from "../../languages";

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
            deepl_api_key: {
              type: "string",
            },
            deepl_config: {
              type: "array",
              items: {
                properties: {
                  content_type: {
                    type: "string",
                    minLength: 1,
                  },
                  fields: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    minLength: 1,
                  },
                },
                required: ["content_type", "fields"],
                type: "object",
              },
            },
          },
        },
      ],
      required: ["default_language", "languages", "content_types"],
      additionalProperties: false,
    },
    metaDefinition: {
      order: [
        "content_types",
        "languages",
        "default_language",
        "deepl_api_key",
        "deepl_config",
      ],
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
        deepl_api_key: {
          label: i18n.t("DeeplApiKey"),
          unique: false,
          helpText: "",
          inputType: "text",
        },
        deepl_config: {
          label: i18n.t("DeeplConfig"),
          helpText: "",
          unique: false,
          inputType: "object",
          items: {
            propertiesConfig: {
              content_type: {
                label: i18n.t("ContentType"),
                helpText: "",
                unique: false,
                inputType: "select",
                optionsWithLabels: contentTypes,
                useOptionsWithLabels: true,
              },
              fields: {
                label: "Fields",
                helpText: "",
                unique: false,
                inputType: "select",
                options: [],
                useOptionsWithLabels: true,
                multiple: true,
              },
            },
            order: ["content_type", "fields"],
          },
        },
      },
    },
  };
};
