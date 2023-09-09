export const environment = {
  production: true,
	develop: false,
  emulator: false,
  proxy: false,
	setDefaultValueToInputs: false,
  apiUrls: {
    panel: 'https://api.beeoclock.com/panel',
    identity: 'https://api.beeoclock.com/identity',
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
