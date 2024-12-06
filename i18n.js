import i18n from "i18next";

i18n.init({
  fallbackLng: "en",
  supportedLngs: ["en", "pl"],
  resources: {
    en: {
      translation: {
        ContentType: "Content Type",
        FieldRequired: "Field is required",
        Fields: "Content type fields to translate",
        Languages: "Available languages",
        Translations: "Translations",
        WrongField:
          "This field type is not supported or content type does not have this field",
      },
    },
    pl: {
      translation: {
        ContentType: "Typ zawartości",
        FieldRequired: "Pole jest wymagane",
        Fields: "Pola typu zawartości do przetłumaczenia",
        Languages: "Dostępne języki",
        Translations: "Tłumaczenia",
        WrongField:
          "Ten typ pola nie jest wspierany lub typ zawartości już go nie zawiera",
      },
    },
  },
});

export default i18n;
