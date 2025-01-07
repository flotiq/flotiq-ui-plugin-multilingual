import { allLngValue } from "../plugins";
import { showWarningModal } from "./warning-modal";

export const getUpdateData = (
  currentContentTypes,
  contentTypesAcc,
  defaultLanguage = "",
) => {
  const ctds = currentContentTypes.includes(allLngValue)
    ? Object.keys(contentTypesAcc)
    : currentContentTypes;

  return ctds.map((contentType) => {
    const ctd = contentTypesAcc[contentType];
    const ctdClone = JSON.parse(JSON.stringify(ctd));

    if (!defaultLanguage) removeTranslationsFromContetType(ctdClone);
    else addTranslationsToContentType(ctdClone, defaultLanguage);

    return { ctd, ctdClone };
  });
};

export const getCtdsToRemove = async (
  currentContentTypes,
  contentTypesAcc,
  openModal,
  initialContentTypes = null,
) => {
  const isAll = currentContentTypes.includes(allLngValue);
  if (isAll && initialContentTypes) {
    return [];
  }

  let ctdRemoved = isAll ? Object.keys(contentTypesAcc) : currentContentTypes;

  if (initialContentTypes) {
    ctdRemoved = (
      initialContentTypes.includes(allLngValue)
        ? Object.keys(contentTypesAcc)
        : initialContentTypes
    ).filter(
      (contentType) =>
        !ctdRemoved.find(
          (currentContentType) => currentContentType === contentType,
        ),
    );
  }

  if (!ctdRemoved.length) return [];

  const removeTranslations = await showWarningModal(
    ctdRemoved
      .map((contentType) => contentTypesAcc[contentType]?.label || contentType)
      .join(", "),
    openModal,
  );

  if (!removeTranslations) return [];
  return ctdRemoved;
};

const removeTranslationsFromContetType = (contentType) => {
  contentType.metaDefinition.order = contentType.metaDefinition.order.filter(
    (name) => name !== "__translations",
  );
  delete contentType.metaDefinition.propertiesConfig.__translations;

  contentType.schemaDefinition.required =
    contentType.schemaDefinition.required.filter(
      (name) => name !== "__translations",
    );
  delete contentType.schemaDefinition.allOf[1].properties.__translations;
};

const addTranslationsToContentType = async (contentType, defaultLanguage) => {
  const order = contentType.metaDefinition.order.filter(
    (key) => !["__translations", "__language"].includes(key),
  );

  const translationPropertiesConfig = order.reduce((config, key) => {
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
      order: [...order, "__language"],
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

  const translationProperties = order.reduce((config, key) => {
    config[key] = contentType.schemaDefinition.allOf[1].properties[key];
    return config;
  }, {});

  const requiredFields = contentType.schemaDefinition.required;

  contentType.schemaDefinition.allOf[1].properties.__translations = {
    type: "array",
    items: {
      type: "object",
      required: [
        ...requiredFields.filter(
          (key) => !["__translations", "__language"].includes(key),
        ),
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
