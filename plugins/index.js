import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import cssString from "inline:./styles/style.css";
import { handleManageSchema } from "./manage";
import { handleFormFieldConfig } from "./form-config";

registerFn(pluginInfo, (handler, client, { toast, getPluginSettings }) => {
  /**
   * Add plugin styles to the head of the document
   */
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  handler.on("flotiq.form.field::config", (data) =>
    handleFormFieldConfig(data, getPluginSettings),
  );

  handler.on("flotiq.plugins.manage::form-schema", (data) =>
    handleManageSchema(data, client, toast),
  );
});
