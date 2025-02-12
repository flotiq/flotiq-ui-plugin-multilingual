export const getLanguageKey = (contentType, contentObject, formUniqueKey) =>
  `${contentType.name}-${contentObject?.id || "new"}-${formUniqueKey}`;
