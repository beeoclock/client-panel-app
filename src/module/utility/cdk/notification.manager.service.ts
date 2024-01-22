import {inject, Injectable} from "@angular/core";
import {NotificationCoreService} from "@utility/cdk/notification.core.service";
import {RegisterDeviceApiAdapter} from "@identity/adapter/external/api/register-device.api.adapter";
import {ProviderTypeEnum} from "@identity/domain/enum/provider-type.enum";
import {NGXLogger} from "ngx-logger";

/**
 * NotificationManagerService is a service that manages notifications.
 * It uses NotificationCoreService for notification operations.
 * It uses RegisterDeviceApiAdapter to register the device with the server.
 * It also uses NGXLogger for logging.
 */
@Injectable({
	providedIn: 'root'
})
export class NotificationManagerService {

	/**
	 * notificationService is an instance of NotificationCoreService.
	 */
	private readonly notificationService = inject(NotificationCoreService);

	/**
	 * registerDeviceApiAdapter is an instance of RegisterDeviceApiAdapter.
	 */
	private readonly registerDeviceApiAdapter = inject(RegisterDeviceApiAdapter);

	/**
	 * ngxLogger is an instance of NGXLogger.
	 */
	private readonly ngxLogger = inject(NGXLogger);

	/**
	 * initialize is a method that initializes the notification manager.
	 * It requests permission for notifications and then subscribes to the token$ observable.
	 * When a token is received, it is sent to the server and saved locally.
	 */
	public async initialize() {

		this.ngxLogger.debug('[NOTIFICATION] Initializing notification manager.');

		await this.tryToRestoreToken();

		this.notificationService.token$.subscribe((token) => {

			this.sendTokenToServerAsync(token).then();

			this.saveTokenAsync(token).then();

		});

	}

	public async tryToRestoreToken() {

		this.ngxLogger.debug('[NOTIFICATION] Trying to restore token.');

		const token = await this.getTokenAsync();

		if (token) {

			this.ngxLogger.debug('[NOTIFICATION] Token restored.', token);

			this.notificationService.token$.next(token);

		}

	}

	public async getTokenAsync() {

		this.ngxLogger.debug('[NOTIFICATION] Getting token from local storage.');

		return localStorage.getItem('fcmToken');

	}

	/**
	 * saveTokenAsync is a method that saves the FCM token to local storage.
	 * @param token - The FCM token to be saved.
	 */
	private async saveTokenAsync(token: string | null) {

		this.ngxLogger.debug('[NOTIFICATION] Saving token to local storage.');

		if (token) {

			localStorage.setItem('fcmToken', token);

		} else {

			localStorage.removeItem('fcmToken');

		}

		return true;

	}

	/**
	 * sendTokenToServerAsync is a method that sends the FCM token to the server.
	 * It also sends the previous token, if any.
	 * @param token - The FCM token to be sent.
	 */
	private async sendTokenToServerAsync(token: string | null) {

		this.ngxLogger.debug('[NOTIFICATION] Sending token to server.');

		const prevToken = await this.getTokenAsync();

		if (prevToken === token) {
			this.ngxLogger.debug('[NOTIFICATION] Token is the same as the previous one. Skipping.');
			return false;
		}

		const body = {
			providerType: ProviderTypeEnum.firebase,
			deviceToken: token,
			prevDeviceToken: prevToken ?? '',
		};

		this.ngxLogger.debug('[NOTIFICATION] Sending token to server.', body);

		await this.registerDeviceApiAdapter.executeAsync(body);

		return true;

	}

}
