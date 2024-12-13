import deepEqual from "deep-equal";
import pluginInfo from "../../plugin-manifest.json";
import {
  getCtdsToRemove,
  getUpdateData,
} from "../../common/content-type-parser";
import { errorModal } from "../../common/warning-modal";

export const handleRemovedEvent = async (
  client,
  { getPluginSettings, openModal },
) => {
  const config = JSON.parse(getPluginSettings() || "{}").config;
  if (!config?.length) return;

  let showErrorModal = false;

  try {
    const contentTypeNames = config
      .map(({ content_type }) => content_type)
      .filter((ctd) => ctd);

    const { body, ok } = await client.getContentTypes({
      names: contentTypeNames,
      limit: contentTypeNames.length,
    });

    if (!ok) {
      throw new Error(body);
    }

    const contentTypesAcc = (body.data || []).reduce((acc, ctd) => {
      acc[ctd.name] = ctd;
      return acc;
    }, {});

    const ctdsToRemove = await getCtdsToRemove(
      config,
      contentTypesAcc,
      openModal,
    );

    const ctdsWithoutTranslations = getUpdateData(
      ctdsToRemove,
      contentTypesAcc,
      true,
    );

    await Promise.all(
      ctdsWithoutTranslations.map(async ({ ctd, ctdClone }) => {
        const isSame = deepEqual(ctd, ctdClone);
        if (isSame) return;

        const { body, ok } = await client[ctd.name].putContentType(ctdClone);

        if (!ok) {
          console.error(
            pluginInfo.id,
            "updating schema (after removing plugin)",
            ctd.name,
            body,
          );
          showErrorModal = true;
        }
      }),
    );
  } catch (e) {
    console.error(pluginInfo.id, "removing error", e);
    showErrorModal = true;
  }

  if (showErrorModal) {
    await errorModal(openModal);
  }
};
