// config/i18n.js

const i18n = require('i18next');
const Backend = require('i18next-fs-backend');
const Middleware = require('i18next-http-middleware');  // Correct middleware import

i18n
  .use(Backend)
  .use(Middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr'],
    ns: ['translations'],
    defaultNS: 'translations',
    backend: {
      loadPath: __dirname + '/../locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      caches: ['cookie']
    }
  });

module.exports = i18n;
