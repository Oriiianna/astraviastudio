import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import { idiomaDeRuta } from "./utils/idioma.js";

const resources = {
  es: { translation: es },
  en: { translation: en },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // El idioma de la URL manda (/es, /en). En "/" y rutas viejas queda sin
    // fijar y lo resuelve el detector, que es lo que usa la redirección.
    ...(idiomaDeRuta(window.location.pathname) && {
      lng: idiomaDeRuta(window.location.pathname),
    }),
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    // Sin esto "en-US" no cuenta como soportado y, como el <html lang="es"> también
    // entra en la detección, gana siempre "es": un navegador en inglés veía español.
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng.startsWith("en") ? "en" : "es";
});

export default i18n;
