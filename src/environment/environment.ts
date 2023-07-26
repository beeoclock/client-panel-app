// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The settings of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emulator: false,
  proxy: false,
  apiUrls: {
    panel: 'api.panel',
    identity: 'api.identity',
  },
  endpoint: {
    config: {
      replace: false,
      loading: false,
      defaultErrorHandler: true,
    }
  },
  config: {
    language: 'en',
    modal: {
      prefix: 'beeoclock_modal_'
    },
    database: {
      name: 'beeoclock',
      version: 1,
      objectStoresMeta: [{
        store: 'cache',
        storeConfig: { keyPath: 'key', autoIncrement: true },
        storeSchema: [
          { name: 'key', keypath: 'key', options: { unique: false } },
          { name: 'value', keypath: 'value', options: { unique: false } }
        ]
      }]
    },
    pagination: {
      maxLength: 5
    }
  },
  firebase: {
    options: {
      apiKey: "AIzaSyDwj-I3xgErbKnJqMVGqd1uqIb20qRlS44",
      authDomain: "bee-o-clock.firebaseapp.com",
      projectId: "bee-o-clock",
      storageBucket: "bee-o-clock.appspot.com",
      messagingSenderId: "188732223564",
      appId: "1:188732223564:web:734881810e32c41d0504e9"
    },
    emulator: {
      all: false,
      authorization: false,
      functions: false
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
