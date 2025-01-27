export const getLanguageKey = (contentType, contentObject) =>
  `${contentType.name}-${contentObject?.id || "new"}`;
