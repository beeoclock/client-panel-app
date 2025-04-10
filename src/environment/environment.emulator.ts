import {config, constant, endpoint} from "@environment/constant";

export const environment = {
	production: false,
	develop: true,
	emulator: true,
	proxy: false,
	setDefaultValueToInputs: false,
	apiUrls: {
		analytic: 'https://api-dev.beeoclock.com/analytic',
		panel: 'https://api-dev.beeoclock.com/panel',
		identity: 'https://api-dev.beeoclock.com/identity',
		tariffPlan: 'https://api-dev.beeoclock.com/tariff-plan',
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
			all: true,
			authorization: false,
			functions: false
		},
		scriptURL: 'firebase-messaging-sw.js'
	},
	urls: {
		publicPageOrigin: 'https://dev.beeoclock.com',
	},
	footer: {
		label: `Bee o'clock Enulator © 2025`
	}
};
