const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

i18next
  .use(Backend)
  .init({
    lng: 'es',
    fallbackLng: 'es',

    preload: ['es', 'en'],

    backend: {
      loadPath: path.join(
        __dirname,
        '../translate/{{lng}}/translation.json'
      )
    },

    interpolation: {
      escapeValue: false
    }
  });

module.exports = i18next;