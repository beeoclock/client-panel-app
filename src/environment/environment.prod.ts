import {config, constant, endpoint} from "@environment/constant";

export const environment = {
	production: true,
	develop: false,
	emulator: false,
	proxy: false,
	setDefaultValueToInputs: false,
	apiUrls: {
		analytic: 'https://api.beeoclock.com/analytic',
		panel: 'https://api.beeoclock.com/panel',
		identity: 'https://api.beeoclock.com/identity',
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
	}
};
