'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'dsmi',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    SUPABASEURL: process.env.SUPABASEURL,
    SUPABASETOKEN: process.env.SUPABASETOKEN,
    ALGOLIAID: process.env.ALGOLIAID,
    ALGOLIAKEY: process.env.ALGOLIAKEY,
    ALGOLIAINDEX: process.env.ALGOLIAINDEX,
  };

  if (environment === 'development') {
    //
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    //
  }

  return ENV;
};
