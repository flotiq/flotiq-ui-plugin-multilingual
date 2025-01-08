import pluginInfo from "../../plugin-manifest.json";
import {
  getCachedElement,
  removeRoot,
} from "../../common/plugin-element-cache";
import { getSchema } from "./lib/form-schema";
import { getSubmitHandler } from "./lib/submit";
import { onValidate } from "./lib/validator";
import i18n from "../../i18n";
import { allLngValue } from "..";

export const handleManageSchema = (data, client, globals) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey)?.element;

  if (!formSchema) {
    const ctds = data.contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    ctds.unshift({
      value: allLngValue,
      label: i18n.t("All"),
    });

    const onSubmit = getSubmitHandler(data, client, globals);

    formSchema = {
      options: {
        disbaledBuildInValidation: true,
        onValidate,
        onSubmit,
      },
      schema: getSchema(ctds),
    };
  }

  data.modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
