import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "@environment/environment";
import {getAnalytics, provideAnalytics} from "@angular/fire/analytics";
import {getMessaging, provideMessaging} from "@angular/fire/messaging";
import {connectAuthEmulator, getAuth, provideAuth} from "@angular/fire/auth";
import {browserLocalPersistence} from "@firebase/auth";

export const firebase = [
	provideFirebaseApp(() =>
		initializeApp(environment.firebase.options)
	),
	provideAnalytics(() => getAnalytics()),
	provideMessaging(() => getMessaging()),
	provideAuth(() => {
		const auth = getAuth();
		auth.setPersistence(browserLocalPersistence)
			.catch((error) => {
				console.error(error);
			});
		if (environment.firebase.emulator.all || environment.firebase.emulator.authorization) {
			connectAuthEmulator(auth, 'http://localhost:9099');
		}
		return auth;
	}),
];
