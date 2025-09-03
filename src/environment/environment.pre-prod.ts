import {config, constant, endpoint} from "@environment/constant";
import {CurrencyCodeEnum} from "@core/shared/enum";

export const environment = {
	production: false,
	develop: true,
	emulator: false,
	proxy: false,
	setDefaultValueToInputs: false,
	apiUrls: {
		analytic: 'https://api-pre-prod.beeoclock.com/analytic',
		panel: 'https://api-pre-prod.beeoclock.com/panel',
		identity: 'https://api-pre-prod.beeoclock.com/identity',
		tariffPlan: 'https://api-pre-prod.beeoclock.com/tariff-plan',
		plugin: 'https://api-pre-prod.beeoclock.com/plugin',
		ws: {
			url: 'https://api-pre-prod.beeoclock.com',
			path: '/ws/panel/socket.io'
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
			appId: "1:188732223564:web:433e1a365a435a000504e9",
			measurementId: "G-54E19X7YEV",
			vapidKey: "BKodl-cUANXAL7BR8m1MFJHuXnTSfIh35T4rJIVKOGarmahKI0k8d"
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
		publicPageOrigin: 'https://pre-prod.beeoclock.com',
		technicalSupport: 'https://beeoclock.atlassian.net/servicedesk/customer/portal/1',
	},
	footer: {
		label: `Bee o'clock Dev © 2025`
	},
	default: {
		login: import.meta?.env?.NG_APP_LOGIN || null,
		password: import.meta?.env?.NG_APP_PASSWORD || null,
		currency: (import.meta?.env?.NG_APP_CURRENCY ||  CurrencyCodeEnum.PLN) as CurrencyCodeEnum,
	},
	demo: {
		credential: {
			login: 'demo@beeoclock.com',
			password: 'ItIckBeRSOLDENZYGosicirE'
		}
	}
};
