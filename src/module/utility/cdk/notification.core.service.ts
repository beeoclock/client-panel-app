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

	private readonly scriptURL = environment.production ? 'firebase-messaging-sw.prod.js' : 'firebase-messaging-sw.dev.js';

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
			await (new Promise(resolve => {
				setTimeout(() => {
					resolve(this.requestPermissionAsync());
				}, 5000);
			}));
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

		const serviceWorkerRegistration = await navigator.serviceWorker.register(this.scriptURL, {
			type: 'module',
			scope: '__'
		});

		this.ngxLogger.debug('[NOTIFICATION] Service worker registered', serviceWorkerRegistration);

		const token = await getToken(this.messaging, {
			serviceWorkerRegistration,
			vapidKey: environment.firebase.options.vapidKey,
		});

		this.ngxLogger.debug('[NOTIFICATION] Token', token);

		this.token$.next(token);

		return token;

	}

}
