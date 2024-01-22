import {inject, Injectable} from "@angular/core";
import {NotificationCoreService} from "@utility/cdk/notification.core.service";
import {is} from "thiis";
import {filter} from "rxjs";
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

		await this.notificationService.requestPermissionAsync();

		this.notificationService.token$.pipe(filter(is.string_not_empty<string>)).subscribe((token) => {

			this.sendTokenToServerAsync(token).then();

			this.saveTokenAsync(token).then();

		});

	}

	/**
	 * saveTokenAsync is a method that saves the FCM token to local storage.
	 * @param token - The FCM token to be saved.
	 */
	private async saveTokenAsync(token: string) {

		this.ngxLogger.debug('[NOTIFICATION] Saving token to local storage.');

		localStorage.setItem('fcmToken', token);

	}

	/**
	 * sendTokenToServerAsync is a method that sends the FCM token to the server.
	 * It also sends the previous token, if any.
	 * @param token - The FCM token to be sent.
	 */
	private async sendTokenToServerAsync(token: string) {

		this.ngxLogger.debug('[NOTIFICATION] Sending token to server.');

		const prevToken = localStorage.getItem('fcmToken');

		const body = {
			providerType: ProviderTypeEnum.firebase,
			deviceToken: token,
			prevDeviceToken: prevToken ?? '',
		};

		this.ngxLogger.debug('[NOTIFICATION] Sending token to server.', body);

		await this.registerDeviceApiAdapter.executeAsync(body);

	}

}
