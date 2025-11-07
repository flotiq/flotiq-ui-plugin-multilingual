import pluginInfo from "../../plugin-manifest.json";
import { allLngValue } from "../languages";
import { handleCoFormConfig } from "./co-form";
import { handlePluginFormConfig } from "./plugin-form";

export const handleFormFieldConfig = (data, getPluginSettings) => {
  if (
    data.contentType?.id === pluginInfo.id &&
    data.contentType?.nonCtdSchema &&
    data.name
  ) {
    return handlePluginFormConfig(data);
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  const isMultilingual = parsedSettings?.content_types?.find((ctd) =>
    [allLngValue, data?.contentType?.name].includes(ctd),
  );

  if (!isMultilingual) return;

  handleCoFormConfig(data, parsedSettings.default_language);
};
