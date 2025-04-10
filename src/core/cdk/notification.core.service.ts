import {inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {getToken, MessagePayload, Messaging, onMessage} from "@angular/fire/messaging";
import {environment} from "@environment/environment";
import {NGXLogger} from "ngx-logger";

/**
 * NotificationCoreService is a service that handles push notifications.
 * It uses Firebase Cloud Messaging for push notifications.
 * It also uses NGXLogger for logging.
 */
@Injectable({
	providedIn: 'root'
})
export class NotificationCoreService {

	/**
	 * token$ is a BehaviorSubject that holds the current FCM token.
	 */
	public readonly token$ = new BehaviorSubject<string | null>(null);
	/**
	 * message$ is a BehaviorSubject that holds the last received FCM message.
	 */
	public readonly message$ = new BehaviorSubject<MessagePayload | null>(null);

	private readonly messaging = inject(Messaging);
	private readonly ngxLogger = inject(NGXLogger);

	private readonly scriptURL = environment.firebase.scriptURL;

	/**
	 * initialize is a method that initializes the FCM token and message handler.
	 */
	public async initialize() {

		if (!this.messaging) {
			return;
		}

		await this.initTokenAsync();
		this.initMessageHandler();

	}

	public get permissionIsGranted() {
		if (!Notification) {
			return false;
		}
		return this.token$.getValue() !== null;
	}

	public async revokePermissionAsync() {
		this.token$.next(null);
		return true;
	}

	public async pushTokenAsync(token: string) {
		if (!token) {
			return false;
		}
		this.token$.next(token);
		return true;
	}

	/**
	 * requestPermissionAsync is a method that requests the user's permission to show notifications.
	 * If the permission is granted, it initializes the FCM.
	 */
	public async requestPermissionAsync() {
		const notificationPermission = await Notification.requestPermission();

		if (notificationPermission === 'granted') {
			this.ngxLogger.debug('[NOTIFICATION] Notification permission granted.');
			await this.initialize();
		} else {
			this.ngxLogger.debug('[NOTIFICATION] Unable to get permission to notify.');

			// Check if push notifications are supported and allowed
			if (navigator.serviceWorker && window.PushManager && window.Notification) {
				// Request permission to send push notifications
				navigator.serviceWorker.getRegistration().then((registration) => {
					if (!registration) {
						this.ngxLogger.debug('[NOTIFICATION] Service worker not registered.');
						return;
					}
					registration.pushManager.subscribe({ userVisibleOnly: true }).then((subscription) => {
						this.ngxLogger.debug('[NOTIFICATION] Push notifications are allowed.', subscription);
						//save the push subscription in your database
					}).catch(function(error) {
						console.error('Error:', error);
					});
				});
			}

			// await (new Promise(resolve => {
			// 	setTimeout(() => {
			// 		resolve(this.requestPermissionAsync());
			// 	}, 5000);
			// }));
		}

		return notificationPermission;
	}

	/**
	 * initMessageHandler is a method that initializes the FCM message handler.
	 * When a message is received, it is logged and pushed to message$.
	 */
	private initMessageHandler() {

		onMessage(this.messaging, it => {
			this.ngxLogger.debug('[NOTIFICATION] Message received. ', it);
			this.message$.next(it);
		});

	}

	/**
	 * initTokenAsync is a method that initializes the FCM token.
	 * It registers a service worker, then gets the FCM token and pushes it to token$.
	 */
	private async initTokenAsync() {

		this.ngxLogger.debug('[NOTIFICATION] Pushing token');

		confirm('Push token?');

		const serviceWorkerRegistration = await navigator.serviceWorker.register(this.scriptURL, {
			type: 'module',
		});

		try {
			const pushSubscription = await serviceWorkerRegistration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(environment.firebase.options.vapidKey),
			});

			console.log(pushSubscription.endpoint);
			console.log(pushSubscription.getKey("p256dh"));
			console.log(pushSubscription.getKey("auth"));
			console.log(pushSubscription.toJSON());

			alert(pushSubscription.endpoint);
			alert(pushSubscription.getKey("p256dh"));
			alert(pushSubscription.getKey("auth"));
			alert(JSON.stringify(pushSubscription.toJSON()));
		} catch (error) {
			console.log('Error subscribing to push notifications:', error);
			alert(error)
		}

		this.ngxLogger.debug('[NOTIFICATION] Service worker registered', serviceWorkerRegistration);

		confirm('success');




		const token = await getToken(this.messaging, {
			serviceWorkerRegistration,
			vapidKey: environment.firebase.options.vapidKey,
		});

		this.ngxLogger.debug('[NOTIFICATION] Token', token);
		confirm(token);
		alert(token);

		if (confirm('Run test?')) {

			const title = "Push title";
			const options = {
				body: "Additional text with some description",
				icon: "https://andreinwald.github.io/webpush-ios-example/images/favicon.png",
				image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
				data: {
					"url": "https://andreinwald.github.io/webpush-ios-example/?page=success",
					"message_id": "your_internal_unique_message_id_for_tracking"
				},
			};
			navigator.serviceWorker.ready.then(function (serviceWorker) {
				serviceWorker.showNotification(title, options);
			});
		}

		this.token$.next(token);

		return token;

	}

}
function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
