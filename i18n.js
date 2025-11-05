import i18n from "i18next";

i18n.init({
  fallbackLng: "en",
  supportedLngs: ["en", "pl"],
  resources: {
    en: {
      translation: {
        All: "All",
        ContentType: "Content Type",
        ContentTypes: "Content Types",
        ContentTypeUpdateError:
          "Cannot update {{name}} Content Type Definition. Please, try again later.",
        Default: "Default",
        DefaultLanguage: "Default language",
        DeleteTranslations: {
          Content:
            "Do you want to also remove the translation field for the Content Types: <strong>{{types}}</strong>? " +
            "This will delete all previously entered translated data for these types. " +
            "This action is irreversible. \n\n" +
            "If you do not agree, you can do this manually later by editing the Content Type Definitions.",
          Keep: "Keep translation fields",
          Remove: "Remove translation fields and data",
          Title: "Do you want to remove translation fields?",
        },
        DeeplApiKey: "DeepL API Key",
        DeeplConfig: "DeepL Configuration",
        FieldRequired: "Field is required",
        Languages: "Available languages",
        MinLanguages: "You have to add at least 2 langugages",
        NoTranslations:
          "Could not find translation field for this Content Type. " +
          "Go to multilingual plugin settings and try to reconfigure plugin.",
        RemoveError:
          "Sorry, there was a problem deleting your data. " +
          "Please go to the edit content type definition page and delete it manually.",
        SettingsUpdateError:
          "Cannot update plugin settings. Please try again later.",
        Translate: "Translate",
        UpdateError:
          "Error occurred while connecting to the server, please try again later.",
        Warning: "Warning!",
        WrongField: "One or more of the selected fields are invalid",
      },
    },
    pl: {
      translation: {
        All: "Wszystkie",
        ContentType: "Typ zawartości",
        ContentTypes: "Typy zawartości",
        ContentTypeUpdateError:
          "Coś poszło nie tak podczas aktualizacji definicji typu {{name}}. Spróbuj ponownie później.",
        Default: "Domyślny",
        DefaultLanguage: "Domyślny język",
        DeleteTranslations: {
          Content:
            "Czy chcesz usunąć również pole związane z tłumaczeniami dla definitcji typów: " +
            "<strong>{{types}}</strong>? " +
            "Spowoduje to usunięcie wszystkich wcześniej wprowadzonych przetłumaczonych danych dla tych typów. " +
            "Ta akcja jest nieodwracalna. \n\n" +
            "Jeśli się nie zgodzisz, będziesz mógł zrobić to później ręcznie poprzez edycję definicji typu.",
          Keep: "Zachowaj pola tłumaczeń",
          Remove: "Usuń pola tłumaczeń i dane",
          Title: "Czy chcesz usunąć pola tłumaczeń?",
        },
        DeeplApiKey: "Klucz API do DeepL",
        DeeplConfig: "Konfiguracja DeepL",
        FieldRequired: "Pole jest wymagane",
        Languages: "Dostępne języki",
        MinLanguages: "Musisz dodać co najmniej dwa języki",
        NoTranslations:
          "Nie udało się znaleźć pola z tłumaczeniami. " +
          "Przejdź do ustawień wtyczki multilingual i spróbuj ponownie ją skonfigurować.",
        RemoveError:
          "Przepraszamy, wystąpił problem podczas usuwania Twoich danych. " +
          "Proszę, przejdź do strony edycji definicji typu zawartości i usuń je ręcznie.",
        SettingsUpdateError:
          "Coś poszło nie tak podczas aktualizacji ustawień plugin. Spróbuj ponownie później",
        Translate: "Tłumacz",
        UpdateError:
          "Wystąpił błąd połączenia z serwerem, spróbuj ponownie później.",
        Warning: "Uwaga!",
        WrongField: "Jedno lub więcej z wybranych pól jest nieprawidłowe",
      },
    },
  },
});

export default i18n;
