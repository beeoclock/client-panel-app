import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {Store} from "@ngxs/store";
import {AppState} from "@utility/state/app/app.state";
import {DOCUMENT} from "@angular/common";
import {LanguageService} from "@utility/cdk/language.service";
import {filter} from "rxjs";
import {is} from "@utility/checker";
import {SplashScreenService} from "@utility/cdk/splash-screen.service";
import {ThemeService} from "@utility/cdk/theme.service";
import {CheckForUpdatePwaService} from "@utility/cdk/check-for-update-pwa.service";
import {NotificationManagerService} from "@utility/cdk/notification.manager.service";
import {AppActions} from "@utility/state/app/app.actions";
import {Reactive} from "@utility/cdk/reactive";
import {Customers} from "@src/database/tenant/signaldb/tenant.signaldb.database";

@Component({
	selector: 'app-root',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterModule,
	],
	template: `
		<router-outlet/>
	`,
})
export class MainRouterOutlet extends Reactive implements AfterViewInit {

	private readonly store = inject(Store);
	private readonly languageService = inject(LanguageService);
	private readonly themeService = inject(ThemeService);
	private readonly splashScreenService = inject(SplashScreenService);
	private readonly checkForUpdatePwaService = inject(CheckForUpdatePwaService);
	private readonly document = inject(DOCUMENT);
	private readonly notificationManagerService = inject(NotificationManagerService);

	constructor() {
		super();
		this.languageService.initialize();
		this.themeService.initialize();
		this.checkForUpdatePwaService.initialize();

		const customers = Customers.find().fetch();
		console.log('0;', customers);
	}

	public ngAfterViewInit(): void {

		this.notificationManagerService.initialize().then();

		const html = this.document.querySelector('html');
		if (html) {
			detectorInit(html);
		}

		this.store.select(AppState.pageLoading)
			.pipe(
				filter(is.false)
			)
			.subscribe(() => {
				this.splashScreenService.hide();
			});

		this.store.dispatch(new AppActions.PageLoading(false));

	}

}
