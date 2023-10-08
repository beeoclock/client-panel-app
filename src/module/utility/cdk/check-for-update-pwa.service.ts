import {ApplicationRef, inject, Injectable} from "@angular/core";
import {SwUpdate} from "@angular/service-worker";
import {NGXLogger} from "ngx-logger";
import {AlertController} from "@ionic/angular";
import {concat, first, interval} from "rxjs";
import {is} from "thiis";
import {TranslateService} from "@ngx-translate/core";
import {SECONDS_TEN_MINUTES} from "@utility/domain/const/c.time";

@Injectable({
	providedIn: 'root'
})
export class CheckForUpdatePwaService {

	private readonly alertController = inject(AlertController);
	private readonly logger = inject(NGXLogger);
	private readonly swUpdate = inject(SwUpdate);
	private readonly applicationRef = inject(ApplicationRef);
	private readonly translateService = inject(TranslateService);

	public initialize(): void {
		const isEnabled = this.swUpdate.isEnabled;
		this.logger.info(`Check for update is ${isEnabled ? 'enabled' : 'disabled'}`);
		if (isEnabled) {
			this.promptOnUpdateAvailable();
			this.checkForUpdateAfterInterval(SECONDS_TEN_MINUTES);
		}
	}

	private promptOnUpdateAvailable() {
		this.swUpdate.available.subscribe((event) => {
			this.logger.debug('Current version is', event.current);
			this.logger.debug('Available version is', event.available);

			const header = this.translateService.instant('updateAvailable.header');
			const message = this.translateService.instant('updateAvailable.message');

			this.alertController.create({
				header,
				message,
				buttons: [
					{
						text: this.translateService.instant('keyword.capitalize.no'),
						role: 'cancel',
					},
					{
						text: this.translateService.instant('keyword.capitalize.yes'),
						role: 'confirm',
					},
				]
			})
				.then(async (alert) => {

					await alert.present();

					const result = await alert.onDidDismiss();

					if (result.role === 'confirm') {
						this.logger.debug('User continued with update', event.available);
						window.location.reload();
					} else {
						this.logger.debug('User choose to skip update', event.available);
					}
				})
				.catch((error) => {
					this.logger.error(error);
				});

		});
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
