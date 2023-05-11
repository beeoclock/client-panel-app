export const environment = {
  // firebase: {}, // TODO init this data of central panel which will help administrators to open their panels.
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
      apiKey: "AIzaSyB4V6b5T25u43cS8LfpQ02NWq_nP0QgXS4",
      authDomain: "beeoclock-cloud-00000000000000.firebaseapp.com",
      projectId: "beeoclock-cloud-00000000000000",
      storageBucket: "beeoclock-cloud-00000000000000.appspot.com",
      messagingSenderId: "917223590640",
      appId: "1:917223590640:web:9ce518f7fe4fee4380d035",
    },
    emulator: {
      all: false,
      authorization: false,
      functions: false
    }
  }
};
