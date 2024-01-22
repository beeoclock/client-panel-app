import {constant} from "@environment/constant";

export const environment = {
  production: false,
	develop: true,
  emulator: true,
  proxy: false,
	setDefaultValueToInputs: false,
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
	constant,
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
			appId: "1:957741407419:web:cfa84b1e0ac458dfaa5d9e",
			vapidKey: "BHlprMakUwMYPx_Y5xSF8QeaiGOAiMPhdHKmaSTUbgWFdTEsD7Ov42yTEdQdLua4HexFD85gqO1jawbSR0Q-Jw0"
		},
    emulator: {
      all: true,
      authorization: false,
      functions: false
    }
  },
	urls: {
		publicPageOrigin: 'https://dev.beeoclock.com',
	}
};
