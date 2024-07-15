import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Язык по умолчанию
    debug: true,
    interpolation: {
      escapeValue: false, // React уже по умолчанию экранирует значения
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Путь к вашим JSON файлам с переводами
    },
  });

export default i18n;
