import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@shared/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@shared/presentation/component/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from "@angular/common";
import {
	PageLoadingProgressBarComponent
} from "@shared/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";
import {Store} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/identity/presentation/state/identity/identity.state";
import {combineLatest, filter, map, switchMap, tap} from "rxjs";
import {ServiceActions} from "@tenant/service/infrastructure/state/service/service.actions";
import {CURRENT_TENANT_ID, MAIN_CONTAINER_ID, TENANT_ID} from "@src/token";
import {NGXLogger} from "ngx-logger";
import {MS_ONE_MINUTE} from "@shared/domain/const/c.time";
import {EventRequestedActions} from "@tenant/event/infrastructure/state/event-requested/event-requested.actions";
import {
	GetFrontendSettingsAccountApiAdapter
} from "@tenant/account/infrastructure/adapter/external/api/get.frontend-settings.account.api.adapter";
import {ThemeService} from "@core/cdk/theme.service";
import {TranslateService} from "@ngx-translate/core";
import {WhacAMole} from "@shared/presentation/whac-a-mole/whac-a-mole";
import {is} from "@core/shared/checker";
import {Reactive} from "@core/cdk/reactive";
import {SocketActions} from "@shared/state/socket/socket.actions";
import {environment} from "@environment/environment";
import {VisibilityService} from "@core/cdk/visibility.service";
import {IsOnlineService} from "@core/cdk/is-online.service";
import {CustomerModule} from "@tenant/customer/customer.module";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {MemberDataActions} from "@tenant/member/infrastructure/state/data/member.data.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";

@Component({
	selector: 'tenant-router-outlet-component',
	standalone: true,
	template: `

		@if (token$ | async) {

			<utility-navbar-component/>
			<utility-sidebar-component/>

			<div [id]="mainContainerId"
				 class="w-full h-[calc(100dvh-80px)] md:h-dvh overflow-y-auto sm:ml-64 md:ml-80 transition-all">
				<utility-page-loading-progress-bar/>
				<router-outlet/>
			</div>

		}

		<whac-a-mole/>

	`,
	imports: [
		SidebarComponent,
		NavbarComponent,
		RouterOutlet,
		PageLoadingProgressBarComponent,
		AsyncPipe,
		WhacAMole,
	],
	providers: [
		{
			provide: CURRENT_TENANT_ID,
			useFactory: () => {
				const tenantId = inject(TENANT_ID).value;
				return tenantId;
			},
		},
		...CustomerModule.providers,
	],
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'flex',
	}
})
export default class TenantRouterOutletComponent extends Reactive implements OnInit, AfterViewInit, OnDestroy {

	public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
	public readonly getFrontendSettingsAccountApiAdapter = inject(GetFrontendSettingsAccountApiAdapter);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly themeService = inject(ThemeService);
	private readonly translateService = inject(TranslateService);
	private readonly visibilityService = inject(VisibilityService);
	private readonly isOnlineService = inject(IsOnlineService);
	private readonly tenantId$ = inject(TENANT_ID);

	public readonly token$ = this.store.select(IdentityState.token);

	private checkerTimer: undefined | NodeJS.Timeout;
	private isUserOnWebSite = true;

	public readonly businessProfile$ = this.store.select(BusinessProfileState.item);

	public ngOnInit(): void {

		this.initNotificationChecker();

		this.isOnlineService.isOnline$.pipe(this.takeUntil(), filter(is.true)).subscribe(() => {
			/**
			 * Sync all data when the user is online
			 */
			BaseSyncManager.syncAll().then();

		})

		this.visibilityService.visibility$.pipe(
			this.takeUntil()
		).subscribe((visible) => {

			this.isUserOnWebSite = visible;
			if (visible) {
				BaseSyncManager.syncAll().then();
			}

		});

		this.connectWebSocket();
	}

	public ngAfterViewInit(): void {
		this.initMemberList();
		this.initAccountFrontendSettings();

		this.businessProfile$.pipe(this.takeUntil()).subscribe((businessProfile) => {
			if (!businessProfile) {
				return;
			}
			const {bookingSettings} = businessProfile;
			const {autoBookOrder} = bookingSettings;
			if (is.false(autoBookOrder)) this.initEventRequested();
		});

	}

	private initMemberList(): void {
		this.store.dispatch(new MemberDataActions.GetList());
	}

	private initEventRequested(): void {
		this.store.dispatch(new EventRequestedActions.GetList());
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
					this.ngxLogger.info(TenantRouterOutletComponent.name, 'initNotificationChecker', 'TODO: IMPLEMENT REQUEST TO GET NOTIFICATION!')
				}

				this.clearNotificationChecker();
				this.initNotificationChecker();

			}, MS_ONE_MINUTE);
		}
	}

	public override ngOnDestroy(): void {
		this.store.dispatch(new ServiceActions.Init());
		this.store.dispatch(new MemberDataActions.Init());
		this.store.dispatch(new EventRequestedActions.Init());
		this.store.dispatch(new SocketActions.DisconnectSocket());
		super.ngOnDestroy();
	}

	private connectWebSocket(): void {
		combineLatest([
			this.store.select(IdentityState.token).pipe(filter(is.object<BeeoclockIdTokenResult>)),
			this.tenantId$.pipe(filter(is.string))
		])
			.pipe(
				this.takeUntil(),
				map(([beeoclockTokenResult, tenantId]) => {
					const {token} = beeoclockTokenResult;
					return {token, tenantId};
				}),
				switchMap(({token, tenantId}) => {
					this.ngxLogger.info(TenantRouterOutletComponent.name, 'connectWebSocket:DisconnectSocket', {
						token,
						tenantId
					});
					return this.store.dispatch(new SocketActions.DisconnectSocket()).pipe(
						map(() => ({token, tenantId}))
					);
				})
			).subscribe({
			next: ({token, tenantId}) => {
				this.ngxLogger.info(TenantRouterOutletComponent.name, 'connectWebSocket:ConnectSocket', {token, tenantId});
				this.store.dispatch(new SocketActions.ConnectSocket({
					url: environment.apiUrls.ws.url,
					options: {
						query: {
							tenantId,
							token
						},
						path: environment.apiUrls.ws.path,
						transports: ['websocket']
					}
				}));
			},
		});
	};
}


