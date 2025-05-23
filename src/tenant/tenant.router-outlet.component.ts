import {AfterViewInit, Component, DestroyRef, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@shared/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@shared/presentation/component/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
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
import {is} from "@core/shared/checker";
import {SocketActions} from "@shared/state/socket/socket.actions";
import {environment} from "@environment/environment";
import {VisibilityService} from "@core/cdk/visibility.service";
import {CustomerModule} from "@tenant/customer/customer.module";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {MemberDataActions} from "@tenant/member/member/infrastructure/state/data/member.data.actions";
import {
	BusinessProfileState
} from "@tenant/business-profile/infrastructure/state/business-profile/business-profile.state";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {explicitEffect} from "ngxtension/explicit-effect";
import {injectNetwork} from "ngxtension/inject-network";

@Component({
	selector: 'tenant-router-outlet-component',
	standalone: true,
	template: `

		<utility-navbar-component/>
		<utility-sidebar-component/>

		<div [id]="mainContainerId"
			 class="w-full h-[calc(100dvh-80px)] md:h-dvh overflow-y-auto sm:ml-64 md:ml-80 transition-all">
			<router-outlet/>
		</div>

	`,
	imports: [
		SidebarComponent,
		NavbarComponent,
		RouterOutlet,
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
		class: 'flex overflow-hidden',
	}
})
export default class TenantRouterOutletComponent implements OnInit, AfterViewInit, OnDestroy {

	public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
	public readonly getFrontendSettingsAccountApiAdapter = inject(GetFrontendSettingsAccountApiAdapter);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly themeService = inject(ThemeService);
	private readonly translateService = inject(TranslateService);
	private readonly visibilityService = inject(VisibilityService);
	private readonly network = injectNetwork();
	private readonly tenantId$ = inject(TENANT_ID);
	private readonly destroyRef = inject(DestroyRef);

	private checkerTimer: undefined | NodeJS.Timeout;
	private isUserOnWebSite = true;

	public readonly businessProfile$ = this.store.select(BusinessProfileState.item);
	public readonly businessProfile = toSignal(this.businessProfile$);

	public readonly visibility = toSignal(this.visibilityService.visibility$, {initialValue: true});
	public readonly isSyncing = toSignal(BaseSyncManager.isSyncing$, {initialValue: 0});

	public constructor() {
		explicitEffect([this.network.online, this.visibility], ([isOnline, visible]) => {
			this.isUserOnWebSite = visible;
			const isSyncing = this.isSyncing();

			if ((isOnline || visible) && !isSyncing) {

				const {syncState} = BaseSyncManager.getSyncManager('business-profile');
				const lastSynchronizedIn = syncState?.options?.updatedSince || new Date(0).toISOString();

				// Check if the last synchronized date is older than 1 minute
				if (new Date(lastSynchronizedIn).getTime() < Date.now() - MS_ONE_MINUTE) {

					/**
					 * Sync all data when the user is online
					 */
					BaseSyncManager.syncAll().then();

				}

			}
		});
		explicitEffect([this.businessProfile], ([businessProfile]) => {
			if (!businessProfile) {
				return;
			}
			const {bookingSettings} = businessProfile;
			const {autoBookOrder} = bookingSettings;
			if (is.false(autoBookOrder)) this.initEventRequested();
		})
	}

	public ngOnInit(): void {
		this.initNotificationChecker();
		this.connectWebSocket();
	}

	public ngAfterViewInit(): void {
		this.initMemberList();
		this.initAccountFrontendSettings();
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

	public ngOnDestroy(): void {
		this.store.dispatch(new ServiceActions.Init());
		this.store.dispatch(new MemberDataActions.Init());
		this.store.dispatch(new EventRequestedActions.Init());
		this.store.dispatch(new SocketActions.DisconnectSocket());
	}

	private connectWebSocket(): void {
		combineLatest([
			this.store.select(IdentityState.token).pipe(filter(is.object<BeeoclockIdTokenResult>)),
			this.tenantId$.pipe(filter(is.string))
		])
			.pipe(
				takeUntilDestroyed(this.destroyRef),
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
				this.ngxLogger.info(TenantRouterOutletComponent.name, 'connectWebSocket:ConnectSocket', {
					token,
					tenantId
				});
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


