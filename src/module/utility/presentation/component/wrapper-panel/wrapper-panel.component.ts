import {AfterViewInit, Component, HostBinding, inject, OnDestroy, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/component/navbar/navbar.component';
import {FooterComponent} from '@utility/presentation/component/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, DOCUMENT, NgIf} from "@angular/common";
import {ModalComponent} from "@utility/presentation/component/modal/modal.component";
import {
	PageLoadingProgressBarComponent
} from "@utility/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";
import {Select, Store} from "@ngxs/store";
import {IdentityState} from "@identity/state/identity/identity.state";
import {Observable, tap} from "rxjs";
import {IdTokenResult} from "@angular/fire/auth";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ServiceActions} from "@service/state/service/service.actions";
import {MemberActions} from "@member/state/member/member.actions";
import {EventActions} from "@event/state/event/event.actions";
import {MAIN_CONTAINER_ID} from "@src/token";
import {NGXLogger} from "ngx-logger";
import {MS_ONE_MINUTE} from "@utility/domain/const/c.time";
import {ClientActions} from "@client/state/client/client.actions";
import {EventRequestedActions} from "@event/state/event-requested/event-requested.actions";
import {
	GetFrontendSettingsAccountApiAdapter
} from "@module/account/adapter/external/api/get.frontend-settings.account.api.adapter";
import {ThemeService} from "@utility/cdk/theme.service";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMole} from "@utility/presentation/whac-a-mole/whac-a-mole";
import {ClientState} from "@client/state/client/client.state";
import {is} from "thiis";
import {Reactive} from "@utility/cdk/reactive";

@Component({
	selector: 'utility-wrapper-panel-component',
	standalone: true,
	template: `
		<ng-container *ngIf="token$ | async">

			<utility-navbar-component/>
			<utility-sidebar-component/>

			<div [id]="mainContainerId" class="w-full h-dvh overflow-y-auto sm:ml-64 md:ml-80 transition-all">
				<utility-page-loading-progress-bar/>
				<router-outlet/>
			</div>

		</ng-container>

		<whac-a-mole/>

	`,
	imports: [
		SidebarComponent,
		NavbarComponent,
		FooterComponent,
		RouterOutlet,
		ModalComponent,
		PageLoadingProgressBarComponent,
		NgIf,
		AsyncPipe,
		WhacAMole
	],
	encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent extends Reactive implements AfterViewInit, OnDestroy {

	public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
	private readonly document = inject(DOCUMENT);
	public readonly getFrontendSettingsAccountApiAdapter = inject(GetFrontendSettingsAccountApiAdapter);
	private readonly store = inject(Store);
	private readonly logger = inject(NGXLogger);
	private readonly themeService = inject(ThemeService);
	private readonly translateService = inject(TranslateService);

	@Select(IdentityState.token)
	public readonly token$!: Observable<IdTokenResult | undefined>;

	@HostBinding()
	public class = 'flex';

	private checkerTimer: undefined | NodeJS.Timeout;
	private isUserOnWebSite = true;

	public readonly businessProfile$ = this.store.select(ClientState.item);

	constructor() {
		super();
		this.initNotificationChecker();
	}

	public ngAfterViewInit(): void {
		this.initDetectorIfUserHasActiveWebsite();
		this.initClient();
		this.initMemberList();
		this.initAccountFrontendSettings();

		this.businessProfile$.pipe(this.takeUntil()).subscribe((businessProfile) => {
			if (!businessProfile) { return; }
			const {bookingSettings} = businessProfile;
			const {autoBookOrder} = bookingSettings;
			is.false(autoBookOrder) && this.initEventRequested();
		});

	}

	private initMemberList(): void {
		this.store.dispatch(new MemberActions.GetList());
	}

	private initEventRequested(): void {
		this.store.dispatch(new EventRequestedActions.GetList());
	}

	private initClient(): void {
		this.store.dispatch(new ClientActions.InitClient());
	}

	private initAccountFrontendSettings(): void {
		// TODO: Try to move the method to another place
		this.getFrontendSettingsAccountApiAdapter.execute$().pipe(
			tap((frontendSettings) => {
				if (frontendSettings.businessPanel.theme) {
					this.themeService.toggleTheme(frontendSettings.businessPanel.theme);
				}
				if (frontendSettings.businessPanel.language) {
					this.translateService.use(frontendSettings.businessPanel.language);
				}
			}),
		);
	}

	private clearNotificationChecker(): void {
		clearTimeout(this.checkerTimer);
		this.checkerTimer = undefined;
	}

	private initNotificationChecker(): void {
		if (!this.checkerTimer) {
			this.checkerTimer = setTimeout(() => {
				if (this.isUserOnWebSite) {
					this.logger.info(WrapperPanelComponent.name, 'initNotificationChecker', 'TODO: IMPLEMENT REQUEST TO GET NOTIFICATION!')
				}

				this.clearNotificationChecker();
				this.initNotificationChecker();

			}, MS_ONE_MINUTE);
		}
	}

	private initDetectorIfUserHasActiveWebsite(): void {
		this.document.onvisibilitychange = () => {
			this.isUserOnWebSite = !this.document.hidden;
		};
	}

	public override ngOnDestroy(): void {
		this.store.dispatch(new CustomerActions.Init());
		this.store.dispatch(new ServiceActions.Init());
		this.store.dispatch(new MemberActions.Init());
		this.store.dispatch(new EventActions.Init());
		this.store.dispatch(new EventRequestedActions.Init());
		super.ngOnDestroy();
	}
}


