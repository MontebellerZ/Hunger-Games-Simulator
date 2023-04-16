import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from "./locales/pt/pt.json";
import enUS from "./locales/en/en.json";

const resources = {
    pt: ptBR,
    en: enUS,
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false,
        },
        resources,
    });

export default i18n;
