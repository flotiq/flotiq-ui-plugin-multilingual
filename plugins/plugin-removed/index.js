import deepEqual from "deep-equal";
import pluginInfo from "../../plugin-manifest.json";
import {
  getCtdsToRemove,
  getUpdateData,
} from "../../common/content-type-parser";
import { errorModal } from "../../common/warning-modal";
import { allLngValue } from "..";

export const handleRemovedEvent = async (
  client,
  { getPluginSettings, openModal },
) => {
  const pluginSettings = JSON.parse(getPluginSettings() || "{}");

  let showErrorModal = false;

  try {
    const contentTypeNames = pluginSettings.content_types || [];

    const { body, ok } = await client.getContentTypes(
      contentTypeNames.includes(allLngValue)
        ? { limit: 10000, internal: false }
        : {
            names: contentTypeNames,
            limit: contentTypeNames.length,
          },
    );

    if (!ok) {
      throw new Error(body);
    }

    const contentTypesAcc = (body.data || []).reduce((acc, ctd) => {
      acc[ctd.name] = ctd;
      return acc;
    }, {});

    const ctdsToRemove = await getCtdsToRemove(
      contentTypeNames,
      contentTypesAcc,
      openModal,
    );

    const ctdsWithoutTranslations = getUpdateData(
      ctdsToRemove,
      contentTypesAcc,
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
