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
		analytic: 'https://api-dev.beeoclock.com/analytic',
		panel: 'https://api-dev.beeoclock.com/panel',
		identity: 'https://api-dev.beeoclock.com/identity',
		tariffPlan: 'https://api-dev.beeoclock.com/tariff-plan',
		plugin: 'https://api-dev.beeoclock.com/plugin',
		ws: {
			url: 'https://api-dev.beeoclock.com',
			path: '/ws/panel/socket.io'
		}
	},
	endpoint,
	constant,
	config,
	firebase: {
		options: {
			apiKey: "AIzaSyDpqktdOQyijnyCaiaOl3_DxUQhTu3PjUg",
			authDomain: "beeoclock-develop.firebaseapp.com",
			projectId: "beeoclock-develop",
			storageBucket: "beeoclock-develop.appspot.com",
			messagingSenderId: "957741407419",
			appId: "1:957741407419:web:f5a8613de1f0d7b2aa5d9e",
			vapidKey: "BHlprMakUwMYPx_Y5xSF8QeaiGOAiMPhdHKmaSTUbgWFdTEsD7Ov42yTEdQdLua4HexFD85gqO1jawbSR0Q-Jw0",
			measurementId: "G-BY8R2Y83RS"
		},
		emulator: {
			all: false,
			authorization: false,
			functions: false
		},
		use: {
			messaging: true,
		}
	},
	urls: {
		publicPageOrigin: 'https://dev.beeoclock.com',
	},
	footer: {
		label: `Bee o'clock Default © 2025`
	},
	default: {
		login: process.env.NG_APP_LOGIN || null,
		password: process.env.NG_APP_PASSWORD || null,
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
