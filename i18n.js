import i18n from "i18next";

i18n.init({
  fallbackLng: "en",
  supportedLngs: ["en", "pl"],
  resources: {
    en: {
      translation: {
        ContentType: "Content Type",
        ContentTypeUpdateError:
          "Cannot update {{name}} Content Type Definition. Please, try again later.",
        DefaultLanguage: "Domyślny język",
        FieldRequired: "Field is required",
        Fields: "Content type fields to translate",
        Languages: "Available languages",
        MinLanguages: "You have to add at least 2 langugages",
        NoTranslations:
          "Could not find translation field for this Content Type. " +
          "Go to multilangual plugin settings and try to reconfigure plugin.",
        SettingsUpdateError:
          "Cannot update plugin settings. Please try again later.",
        UpdateError:
          "Error occurred while connecting to the server, please try again later.",
        WrongField:
          "This field type is not supported or content type does not have this field",
      },
    },
    pl: {
      translation: {
        ContentType: "Typ zawartości",
        ContentTypeUpdateError:
          "Coś poszło nie tak podczas aktualizacji definicji typu {{name}}. Spróbuj ponownie później.",
        DefaultLanguage: "Default language",
        FieldRequired: "Pole jest wymagane",
        Fields: "Pola typu zawartości do przetłumaczenia",
        Languages: "Dostępne języki",
        MinLanguages: "Musisz dodać co najmniej dwa języki",
        NoTranslations:
          "Nie udało się znaleźć pola z tłumaczeniami. " +
          "Przejdź do ustawień wtyczki multilangual i spróbuj ponownie ją skonfigurować.",
        SettingsUpdateError:
          "Coś poszło nie tak podczas aktualizacji ustawień plugin. Spróbuj ponownie później",
        UpdateError:
          "Wystąpił błąd połączenia z serwerem, spróbuj ponownie później.",
        WrongField:
          "Ten typ pola nie jest wspierany lub typ zawartości już go nie zawiera",
      },
    },
  },
});

export default i18n;
