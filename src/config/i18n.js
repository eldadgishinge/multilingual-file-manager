const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "fr"],
    backend: {
      loadPath: "locales/{{lng}}/translation.json",
    },
    saveMissing: true,
    detection: {
      order: ["querystring", "cookie"],
      caches: ["cookie"],
    },
  });

module.exports = i18next;
