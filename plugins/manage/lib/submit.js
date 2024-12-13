import pluginInfo from "../../../plugin-manifest.json";
import deepEqual from "deep-equal";
import {
  getCtdsToRemove,
  getUpdateData,
} from "../../../common/content-type-parser";
import i18n from "../../../i18n";

export const getSubmitHandler =
  (
    { contentTypes, reload, modalInstance },
    client,
    { toast, getPluginSettings, openModal },
  ) =>
  async (values) => {
    let close = true;
    const initialSettings = JSON.parse(getPluginSettings() || "{}");
    const currentConfig = values.config || [];

    const contentTypesAcc = (contentTypes || []).reduce((acc, ctd) => {
      acc[ctd.name] = ctd;
      return acc;
    }, {});

    const ctdsWithTranslations = getUpdateData(currentConfig, contentTypesAcc);

    const ctdsToRemove = await getCtdsToRemove(
      currentConfig,
      contentTypesAcc,
      openModal,
      initialSettings,
    );

    const ctdsWithoutTranslations = getUpdateData(
      ctdsToRemove,
      contentTypesAcc,
      true,
    );

    try {
      await Promise.all(
        [...ctdsWithTranslations, ...ctdsWithoutTranslations].map(
          async ({ ctd, ctdClone }) => {
            const isSame = deepEqual(ctd, ctdClone);
            if (isSame) return;

            const { body, ok } =
              await client[ctd.name].putContentType(ctdClone);

            if (!ok) {
              console.error(pluginInfo.id, "updating schema", ctd.name, body);
              toast.error(
                i18n.t("ContentTypeUpdateError", { name: ctd.name }),
                {
                  duration: 5000,
                },
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
