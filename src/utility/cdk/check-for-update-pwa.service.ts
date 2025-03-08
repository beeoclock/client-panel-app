import {ApplicationRef, inject, Injectable} from "@angular/core";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {NGXLogger} from "ngx-logger";
import {concat, first, interval} from "rxjs";
import {is} from "@core/shared/checker";
import {SECONDS_TEN_MINUTES} from "@utility/domain/const/c.time";

@Injectable({
	providedIn: 'root'
})
export class CheckForUpdatePwaService {

	private readonly logger = inject(NGXLogger);
	private readonly swUpdate = inject(SwUpdate);
	private readonly applicationRef = inject(ApplicationRef);

	public initialize(): void {
		const isEnabled = this.swUpdate.isEnabled;
		this.logger.info(`Check for update is ${isEnabled ? 'enabled' : 'disabled'}`);
		if (isEnabled) {
			this.swUpdate.checkForUpdate().then();
			this.promptOnUpdateAvailable();
			this.checkForUpdateAfterInterval(SECONDS_TEN_MINUTES);
		}
	}

	private promptOnUpdateAvailable() {
		this.swUpdate.versionUpdates.subscribe((event) => {
			switch (event.type) {
				case 'VERSION_DETECTED':
					this.logger.debug('Update detected, starting download...');
					break;
				case 'VERSION_READY':
					this.logger.debug('Update ready!');
					this.presentUpdateAvailableAlert(event).then();
					break;
				default:
					this.logger.debug('Update event', event);
			}

		});
	}

	private async presentUpdateAvailableAlert(event: VersionReadyEvent) {

		this.logger.debug('Current version is', event.currentVersion);
		this.logger.debug('Available version is', event.latestVersion);

		window.location.reload();

		// TODO uncomment this when we will put additional info about update

		// const header = this.translateService.instant('updateAvailable.header');
		// const message = this.translateService.instant('updateAvailable.message');
		//
		// this.alertController.create({
		// 	header,
		// 	message,
		// 	buttons: [
		// 		{
		// 			text: this.translateService.instant('keyword.capitalize.no'),
		// 			role: 'cancel',
		// 		},
		// 		{
		// 			text: this.translateService.instant('keyword.capitalize.yes'),
		// 			role: 'confirm',
		// 		},
		// 	]
		// })
		// 	.then(async (alert) => {
		//
		// 		await alert.present();
		//
		// 		const result = await alert.onDidDismiss();
		//
		// 		if (result.role === 'confirm') {
		// 			this.logger.debug('User continued with update', event.latestVersion);
		// 			window.location.reload();
		// 		} else {
		// 			this.logger.debug('User choose to skip update', event.latestVersion);
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		this.logger.error(error);
		// 	});
	}

	/**
	 * Check for updates after interval specified in minutes
	 * @param secondsInterval
	 */
	private checkForUpdateAfterInterval(secondsInterval: number) {
		this.logger.debug('Check for updates initiated!');
		// Allow the app to stabilize first, before starting polling for updates with `interval()`.
		const appIsStable$ = this.applicationRef.isStable.pipe(first(is.true));
		const everyInterval$ = interval(secondsInterval * 1000);
		const everyIntervalOnceAppIsStable$ = concat(appIsStable$, everyInterval$);

		everyIntervalOnceAppIsStable$.subscribe(() => {
			this.swUpdate.checkForUpdate().then();
		});
	}

}
