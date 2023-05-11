export const environment = {
  production: true,
  emulator: false,
  config: {
    language: 'en',
    modal: {
      prefix: 'beeoclock_modal_'
    },
  },
  firebase: {
    options: {
      apiKey: "AIzaSyBbsA4zGz5ffnxmVUSKKuGBV-XlnkrtLgE",
      authDomain: "beeoclock-cloud-00000000000001.firebaseapp.com",
      projectId: "beeoclock-cloud-00000000000001",
      storageBucket: "beeoclock-cloud-00000000000001.appspot.com",
      messagingSenderId: "1024117457795",
      appId: "1:1024117457795:web:f341080322df37c400ecb6",
    },
    emulator: {
      all: false,
      authorization: false,
      functions: false
    }
  }
};
