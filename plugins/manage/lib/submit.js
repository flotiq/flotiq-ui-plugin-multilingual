import i18n from "../../../i18n";
import pluginInfo from "../../../plugin-manifest.json";
import deepEqual from "deep-equal";

const updateContentTypeSchema = async (
  contentType,
  fieldKeys,
  defaultLanguage,
) => {
  const translationPropertiesConfig = fieldKeys.reduce((config, key) => {
    config[key] = contentType.metaDefinition.propertiesConfig[key];
    return config;
  }, {});

  contentType.metaDefinition.propertiesConfig.__translations = {
    helpText: "",
    inputType: "object",
    label: "Translations",
    unique: false,
    hidden: true,
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
          helpText: "",
          inputType: "text",
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
          default: defaultLanguage,
        },
      },
    },
  };
};

export const getSubmitHandler =
  (contentTypes, client, reload, modalInstance, toast) => async (values) => {
    let close = true;

    try {
      await Promise.all(
        values.config.map(
          async ({ content_type, fields, default_language }) => {
            const ctd = contentTypes.find(({ name }) => name === content_type);
            const ctdClone = JSON.parse(JSON.stringify(ctd));

            updateContentTypeSchema(ctdClone, fields, default_language);

            const isSame = deepEqual(ctd, ctdClone);
            if (isSame) return;

            const { body, ok } =
              await client[ctd.name].putContentType(ctdClone);

            if (!ok) {
              console.error(pluginInfo.id, "updating schema", ctd.name, body);
              toast.error(
                i18n.t("ContentTypeUpdateError", { name: ctd.name }),
                { duration: 5000 },
              );
              close = false;
            }
          },
        ),
      );
      const { body, ok } = await client["_plugin_settings"].patch(
        pluginInfo.id,
        {
          settings: JSON.stringify(values),
        },
      );
      if (!ok) {
        console.error(pluginInfo.id, "updating plugin settings", body);
        toast.error(i18n.t("SettingsUpdateError"), { duration: 5000 });
        return [values, body];
      }
      if (close) modalInstance.resolve();
      reload();
      return [body, {}];
    } catch (e) {
      console.error(pluginInfo.id, "updating catch", e);
      toast.error(i18n.t("UpdateError"), { duration: 5000 });
    }
  };
