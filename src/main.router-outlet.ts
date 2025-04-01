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
import {SecondRouterOutlet} from "@src/second.router-outlet";
import {WhacAMole} from "@shared/presentation/whac-a-mole/whac-a-mole";

@Component({
	selector: 'app-root',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		RouterModule,
		SecondRouterOutlet,
		WhacAMole,
	],
	template: `
		<div class="flex-1 overflow-auto">
			<router-outlet/>
		</div>
		<app-second-router-outlet/>


		<whac-a-mole/>
	`,
	host: {
		class: 'flex'
	}
})
export class MainRouterOutlet implements AfterViewInit {

	private readonly store = inject(Store);
	private readonly languageService = inject(LanguageService);
	private readonly themeService = inject(ThemeService);
	private readonly splashScreenService = inject(SplashScreenService);
	private readonly checkForUpdatePwaService = inject(CheckForUpdatePwaService);
	private readonly document = inject(DOCUMENT);
	private readonly notificationManagerService = inject(NotificationManagerService);

	public constructor() {
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
