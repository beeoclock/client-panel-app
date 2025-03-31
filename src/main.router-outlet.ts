import {AfterViewInit, Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterModule} from '@angular/router';
import {detectorInit} from '@src/script/detector';
import {Store} from "@ngxs/store";
import {AppState} from "@shared/state/app/app.state";
import {DOCUMENT} from "@angular/common";
import {LanguageService} from "@core/cdk/language.service";
import {filter} from "rxjs";
import {is} from "@src/core/shared/checker";
import {SplashScreenService} from "@core/cdk/splash-screen.service";
import {ThemeService} from "@core/cdk/theme.service";
import {CheckForUpdatePwaService} from "@core/cdk/check-for-update-pwa.service";
import {NotificationManagerService} from "@core/cdk/notification.manager.service";
import {AppActions} from "@shared/state/app/app.actions";
import {Reactive} from "@core/cdk/reactive";

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
