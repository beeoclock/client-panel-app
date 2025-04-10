import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js';
import {
	getMessaging,
	isSupported,
	onBackgroundMessage
} from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-sw.js';

const app = initializeApp({
	apiKey: "AIzaSyDpqktdOQyijnyCaiaOl3_DxUQhTu3PjUg",
	authDomain: "beeoclock-develop.firebaseapp.com",
	projectId: "beeoclock-develop",
	storageBucket: "beeoclock-develop.appspot.com",
	messagingSenderId: "957741407419",
	appId: "1:957741407419:web:cfa84b1e0ac458dfaa5d9e",
	vapidKey: "BHlprMakUwMYPx_Y5xSF8QeaiGOAiMPhdHKmaSTUbgWFdTEsD7Ov42yTEdQdLua4HexFD85gqO1jawbSR0Q-Jw0",
	measurementId: "G-BY8R2Y83RS"
});

self.addEventListener('push', (event) => {
	console.log("[SW:NOTIFICATION] push", event);

	let data = {};
	try {
		data = event.data.json();
	} catch (e) {
		console.warn('Push event but no JSON data:', e);
	}

	const title = data.title || 'Notification';
	const options = {
		body: data.body || 'No body',
		icon: data.icon || '/assets/icons/icon-72x72.png',
		data: {
			url: data.url || '/' // allow redirection when clicked
		}
	};

	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});

self.addEventListener('notificationclick', function(event) {
	console.log("[SW:NOTIFICATION] notificationclick", event);
	const urlToOpen = event.notification.data?.url || '/';
	event.notification.close();
	event.waitUntil(
		clients.openWindow(urlToOpen)
	);
});

isSupported().then(isSupported => {

	if (isSupported) {

		const messaging = getMessaging(app);

		onBackgroundMessage(messaging, ({ notification: { title, body, image } }) => {
			self.registration.showNotification(title, { body, icon: image || '/assets/icons/icon-72x72.png' });
		});

		self.addEventListener('notificationclick', (event) => {
			console.log("[SW:NOTIFICATION] notificationclick", event)
			const urlToRedirect = event.notification.data.url;
			event.notification.close();
			event.waitUntil(self.clients.openWindow(urlToRedirect));
		});

		// self.addEventListener('push', (event) => {
		// 	console.log("[SW:NOTIFICATION] push", event)
		// 	// if (event.data) {
		// 	// 	const dataText = event.data.text();
		// 	// 	notificationTitle = 'Custom Notification';
		// 	// 	notificationOptions.body = 'Message: ' + `${dataText}`;
		// 	// 	var title = event.data.notification.title;
		// 	// 	var message = event.data.notification.message;
		// 	// 	var icon = event.data.notification.icon;
		// 	// 	var notificationTag = event.data.notification.tag;﻿
		// 	// }
		// });

	}

});
