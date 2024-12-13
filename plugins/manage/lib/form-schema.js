import i18n from "../../../i18n";
import pluginInfo from "../../../plugin-manifest.json";

export const getSchema = (contentTypes) => ({
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
          config: {
            type: "array",
            items: {
              type: "object",
              required: [
                "languages",
                "fields",
                "content_type",
                "default_language",
              ],
              properties: {
                fields: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  minItems: 1,
                },
                languages: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  minItems: 1,
                },
                content_type: {
                  type: "string",
                  minLength: 1,
                },
                default_language: {
                  type: "string",
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    ],
    required: [],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ["config"],
    propertiesConfig: {
      config: {
        items: {
          order: ["content_type", "fields", "languages", "default_language"],
          propertiesConfig: {
            fields: {
              label: i18n.t("Fields"),
              unique: false,
              helpText: "",
              multiple: true,
              inputType: "select",
              optionsWithLabels: [],
              useOptionsWithLabels: true,
            },
            languages: {
              label: i18n.t("Languages"),
              unique: false,
              helpText: "",
              inputType: "simpleList",
            },
            content_type: {
              label: i18n.t("ContentType"),
              unique: false,
              helpText: "",
              isMultiple: false,
              inputType: "select",
              optionsWithLabels: contentTypes,
              useOptionsWithLabels: true,
            },
            default_language: {
              label: i18n.t("DefaultLanguage"),
              unique: false,
              helpText: "",
              isMultiple: false,
              inputType: "select",
              options: [],
            },
          },
        },
        label: "config",
        unique: false,
        helpText: "",
        inputType: "object",
      },
    },
  },
});
