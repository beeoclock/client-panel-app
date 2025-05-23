// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The settings of file replacements can be found in `angular.json`.

import {config, constant, endpoint} from "@environment/constant";

export const environment = {
	production: false,
	develop: true,
	emulator: false,
	proxy: false,
	setDefaultValueToInputs: false,
	apiUrls: {
		analytic: 'http://localhost:3004',
		panel: 'http://localhost:3000',
		identity: 'http://localhost:4000',
		tariffPlan: 'http://localhost:3006',
		plugin: 'http://localhost:3005',
		ws: {
			url: 'http://localhost:3000',
			path: '/socket.io'
		}
	},
	endpoint,
	constant,
	config,
	firebase: {
		options: {
			apiKey: "AIzaSyDwj-I3xgErbKnJqMVGqd1uqIb20qRlS44",
			authDomain: "bee-o-clock.firebaseapp.com",
			projectId: "bee-o-clock",
			storageBucket: "bee-o-clock.appspot.com",
			messagingSenderId: "188732223564",
			appId: "1:188732223564:web:734881810e32c41d0504e9",
			measurementId: "G-J1X4CB0RYW",
			vapidKey: "BKodl-cUANXAL7BR8m1MFJHuXnTSfIh35T4rJIVKOGarmahKI0k8d"
		},
		emulator: {
			all: false,
			authorization: false,
			functions: false
		}
	},
	urls: {
		publicPageOrigin: 'https://beeoclock.com',
	},
	footer: {
		label: `Bee o'clock Local Production © 2025`
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
