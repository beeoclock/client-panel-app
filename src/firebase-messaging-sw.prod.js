import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import {
	getMessaging,
	isSupported,
	onBackgroundMessage
} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

// TODO: Detect which mode we are in (dev or prod) and use the appropriate config
const app = initializeApp({
	apiKey: "AIzaSyDwj-I3xgErbKnJqMVGqd1uqIb20qRlS44",
	authDomain: "bee-o-clock.firebaseapp.com",
	projectId: "bee-o-clock",
	storageBucket: "bee-o-clock.appspot.com",
	messagingSenderId: "188732223564",
	appId: "1:188732223564:web:734881810e32c41d0504e9",
	vapidKey: "BKodl-cUANXAL7BR8m1MFJHuXnTSfIh35T4rJIVKOGarmahKI0k8d"
});

isSupported().then(isSupported => {

	if (isSupported) {

		const messaging = getMessaging(app);

		onBackgroundMessage(messaging, ({ notification: { title, body, image, data } }) => {
			self.registration.showNotification(title, { body, data, icon: image || '/assets/icons/icon-72x72.png' });
		});

		self.addEventListener('notificationclick', (event) => {
			console.log("[SW:NOTIFICATION] notificationclick", event)
			const urlToRedirect = event.notification.data.url;
			event.notification.close();
			event.waitUntil(self.clients.openWindow(urlToRedirect));
		});

		self.addEventListener('push', (event) => {
			console.log("[SW:NOTIFICATION] push", event)
			// if (event.data) {
			// 	const dataText = event.data.text();
			// 	notificationTitle = 'Custom Notification';
			// 	notificationOptions.body = 'Message: ' + `${dataText}`;
			// 	var title = event.data.notification.title;
			// 	var message = event.data.notification.message;
			// 	var icon = event.data.notification.icon;
			// 	var notificationTag = event.data.notification.tag;﻿
			// }
		});

	}

});
