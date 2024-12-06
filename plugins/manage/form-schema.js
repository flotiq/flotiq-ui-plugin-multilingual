import deepEqual from "deep-equal";
import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

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
              required: ["languages", "fields", "content_type"],
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
          order: ["content_type", "fields", "languages"],
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

const addToErrors = (errors, index, field, error) => {
  if (!errors.config) errors.config = [];
  if (!errors.config[index]) errors.config[index] = {};
  errors.config[index][field] = error;
};

export const getValidator = (fieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    values.config?.forEach(({ content_type, languages, fields }, index) => {
      if (!content_type) {
        addToErrors(errors, index, "content_type", i18n.t("FieldRequired"));
      }

      if (!languages?.length) {
        addToErrors(errors, index, "languages", i18n.t("FieldRequired"));
      }

      if (!fields?.length) {
        addToErrors(errors, index, "fields", i18n.t("FieldRequired"));
      } else {
        fields.map((field) => {
          if (!(fieldKeys[content_type] || []).includes(field)) {
            addToErrors(errors, index, "fields", i18n.t("WrongField"));
          }
        });
      }
    });

    return errors;
  };

  return onValidate;
};

const updateContentTypeSchema = async (contentType, fieldKeys, languages) => {
  const translationPropertiesConfig = fieldKeys.reduce((config, key) => {
    config[key] = contentType.metaDefinition.propertiesConfig[key];
    return config;
  }, {});

  contentType.metaDefinition.propertiesConfig.__translations = {
    helpText: "",
    inputType: "object",
    label: i18n.t("Translations"),
    unique: false,
    items: {
      order: [
        ...contentType.metaDefinition.order.filter((key) =>
          fieldKeys.includes(key),
        ),
        "__language",
      ],
      propertiesConfig: {
        ...translationPropertiesConfig,
        __language: {
          label: "Language",
          unique: false,
          options: languages,
          helpText: "",
          inputType: "select",
          useOptionsWithLabels: false,
        },
      },
    },
  };

  if (!contentType.metaDefinition.order.includes("__translations")) {
    contentType.metaDefinition.order.push("__translations");
  }

  const translationProperties = fieldKeys.reduce((config, key) => {
    config[key] = contentType.schemaDefinition.allOf[1].properties[key];
    return config;
  }, {});

  const requiredFields = contentType.schemaDefinition.required;

  contentType.schemaDefinition.allOf[1].properties.__translations = {
    type: "array",
    items: {
      type: "object",
      required: [
        ...requiredFields.filter((key) => fieldKeys.includes(key)),
        "__language",
      ],
      properties: {
        ...translationProperties,
        __language: {
          type: "string",
          minLength: 1,
        },
      },
    },
  };
};

export const getSubmitHandler =
  (contentTypes, client, reload, modalInstance, toast) => async (values) => {
    try {
      await Promise.all(
        values.config.map(async ({ content_type, fields, languages }) => {
          const ctd = contentTypes.find(({ name }) => name === content_type);
          const ctdClone = JSON.parse(JSON.stringify(ctd));

          updateContentTypeSchema(ctdClone, fields, languages);

          const isSame = deepEqual(ctd, ctdClone);
          if (isSame) return;

          const { body, ok } = await client[ctd.name].putContentType(ctdClone);
          if (!ok) {
            toast.error(`Cannot update ${ctd.name}, ${body.message}`);
          }
        }),
      );
      const { body, ok } = await client["_plugin_settings"].patch(
        pluginInfo.id,
        {
          settings: JSON.stringify(values),
        },
      );
      if (!ok) {
        toast.error(body.message || "Not ok");
        return [null, body];
      }
      modalInstance.resolve();
      reload();
      return [body, {}];
    } catch (e) {
      console.log(e);
      toast.error("Something occured");
    }
  };
