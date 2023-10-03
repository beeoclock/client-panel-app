// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The settings of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
	develop: true,
  emulator: false,
  proxy: false,
	setDefaultValueToInputs: false,
  apiUrls: {
    panel: 'local.panel',
    identity: 'local.identity',
  },
  endpoint: {
    config: {
      replace: false,
      loading: false,
      defaultErrorHandler: true,
    }
  },
  config: {
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
			apiKey: "AIzaSyDpqktdOQyijnyCaiaOl3_DxUQhTu3PjUg",
			authDomain: "beeoclock-develop.firebaseapp.com",
			projectId: "beeoclock-develop",
			storageBucket: "beeoclock-develop.appspot.com",
			messagingSenderId: "957741407419",
			appId: "1:957741407419:web:cfa84b1e0ac458dfaa5d9e"
		},
    emulator: {
      all: false,
      authorization: false,
      functions: false
    }
  },
	urls: {
		publicPageOrigin: 'https://dev.beeoclock.com',
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
