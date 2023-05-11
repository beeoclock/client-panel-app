// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The settings of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  config: {
    language: 'en',
    modal: {
      prefix: 'beeoclock_modal_'
    },
  },
  firebase: {
    options: {
      projectId: 'beeoclock-cloud-00000000000000',
      appId: '1:917223590640:web:9ce518f7fe4fee4380d035',
      storageBucket: 'beeoclock-cloud-00000000000000.appspot.com',
      apiKey: 'AIzaSyB4V6b5T25u43cS8LfpQ02NWq_nP0QgXS4',
      authDomain: 'beeoclock-cloud-00000000000000.firebaseapp.com',
      messagingSenderId: '917223590640',
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
