export const environment = {
  production: false,
  emulator: true,
  config: {
    language: 'en',
    modal: {
      prefix: 'beeoclock_modal_'
    },
  },
  firebase: {
    options: {  apiKey: "AIzaSyDwj-I3xgErbKnJqMVGqd1uqIb20qRlS44",
      authDomain: "bee-o-clock.firebaseapp.com",
      projectId: "bee-o-clock",
      storageBucket: "bee-o-clock.appspot.com",
      messagingSenderId: "188732223564",
      appId: "1:188732223564:web:734881810e32c41d0504e9"
      // apiKey: "AIzaSyB4V6b5T25u43cS8LfpQ02NWq_nP0QgXS4",
      // authDomain: "beeoclock-cloud-00000000000000.firebaseapp.com",
      // projectId: "beeoclock-cloud-00000000000000",
      // storageBucket: "beeoclock-cloud-00000000000000.appspot.com",
      // messagingSenderId: "917223590640",
      // appId: "1:917223590640:web:9ce518f7fe4fee4380d035"
    },
    emulator: {
      all: false,
      authorization: false,
      functions: true
    }
  }
};
