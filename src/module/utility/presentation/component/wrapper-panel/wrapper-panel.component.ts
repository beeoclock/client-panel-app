import {AfterViewInit, Component, HostBinding, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {SidebarComponent} from '@utility/presentation/component/sidebar/sidebar.component';
import {NavbarComponent} from '@utility/presentation/component/navbar/navbar.component';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from "@angular/common";
import {
	PageLoadingProgressBarComponent
} from "@utility/presentation/component/page-loading-progress-bar/page-loading-progress-bar.component";
import {Store} from "@ngxs/store";
import {BeeoclockIdTokenResult, IdentityState} from "@identity/state/identity/identity.state";
import {combineLatest, filter, map, switchMap, tap} from "rxjs";
import {CustomerActions} from "@customer/state/customer/customer.actions";
import {ServiceActions} from "@service/state/service/service.actions";
import {MemberActions} from "@member/state/member/member.actions";
import {CURRENT_TENANT_ID, MAIN_CONTAINER_ID, TENANT_ID} from "@src/token";
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
import {is} from "@utility/checker";
import {Reactive} from "@utility/cdk/reactive";
import {SocketActions} from "@utility/state/socket/socket.actions";
import {environment} from "@environment/environment";
import {
	CustomerIndexedDBCollectionManager
} from "@customer/infrastructure/manager/customer.indexedDB.collection.manager";
import {CustomerIndexedDBFacade} from "@customer/infrastructure/facade/indexedDB/customer.indexedDB.facade";
import {ServiceIndexedDBCollectionManager} from "@service/infrastructure/manager/service.indexedDB.collection.manager";
import {ServiceIndexedDBFacade} from "@service/infrastructure/facade/indexedDB/service.indexedDB.facade";
import {VisibilityService} from "@utility/cdk/visibility.service";
import {SyncManagerService} from "@src/core/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {AbsenceIndexedDBFacade} from "@absence/infrastructure/facade/indexedDB/absence.indexedDB.facade";
import {AbsenceIndexedDBCollectionManager} from "@absence/infrastructure/manager/absence.indexedDB.collection.manager";
import {MemberIndexedDBFacade} from "@member/infrastructure/facade/indexedDB/member.indexedDB.facade";
import {MemberIndexedDBCollectionManager} from "@member/infrastructure/manager/member.indexedDB.collection.manager";
import {OrderIndexedDBFacade} from "@order/infrastructure/facade/indexedDB/order.indexedDB.facade";
import {OrderIndexedDBCollectionManager} from "@order/infrastructure/manager/order.indexedDB.collection.manager";
import {
	BusinessProfileIndexedDBFacade
} from "@client/infrastructure/facade/indexedDB/business-profile.indexedDB.facade";
import {
	BusinessProfileIndexedDBCollectionManager
} from "@client/infrastructure/manager/business-profile.indexedDB.collection.manager";
import {IsOnlineService} from "@utility/cdk/is-online.service";
import {Auth, Unsubscribe} from "@angular/fire/auth";

@Component({
	selector: 'utility-wrapper-panel-component',
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
		/**
		 * CUSTOMER
		 */
		CustomerIndexedDBCollectionManager,
		CustomerIndexedDBFacade,
		/**
		 * SERVICE
		 */
		ServiceIndexedDBCollectionManager,
		ServiceIndexedDBFacade,
		/**
		 * ABSENCE
		 */
		AbsenceIndexedDBCollectionManager,
		AbsenceIndexedDBFacade,
		/**
		 * MEMBER
		 */
		MemberIndexedDBCollectionManager,
		MemberIndexedDBFacade,
		/**
		 * MEMBER
		 */
		OrderIndexedDBCollectionManager,
		OrderIndexedDBFacade,
		/**
		 * BUSINESS PROFILE
		 */
		BusinessProfileIndexedDBCollectionManager,
		BusinessProfileIndexedDBFacade,
	],
	encapsulation: ViewEncapsulation.None
})
export default class WrapperPanelComponent extends Reactive implements OnInit, AfterViewInit, OnDestroy {

	public readonly mainContainerId = inject(MAIN_CONTAINER_ID);
	public readonly getFrontendSettingsAccountApiAdapter = inject(GetFrontendSettingsAccountApiAdapter);
	private readonly store = inject(Store);
	private readonly ngxLogger = inject(NGXLogger);
	private readonly themeService = inject(ThemeService);
	private readonly translateService = inject(TranslateService);
	private readonly visibilityService = inject(VisibilityService);
	private readonly isOnlineService = inject(IsOnlineService);
	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	private readonly auth = inject(Auth);

	public readonly token$ = this.store.select(IdentityState.token);

	@HostBinding()
	public class = 'flex';

	private checkerTimer: undefined | NodeJS.Timeout;
	private isUserOnWebSite = true;

	public readonly businessProfile$ = this.store.select(ClientState.item);

	constructor() {
		super();
		this.initNotificationChecker();
	}

	public ngOnInit(): void {

		this.isOnlineService.isOffline$.pipe(this.takeUntil()).subscribe((isOffline) => {
			console.log({isOffline});

			if (!isOffline) {
				return;
			}

			console.log('isOffline:identity:', {currentUser: this.auth.currentUser}, this.auth);

			// Check if user is not authorized!
			if (!this.auth.currentUser) {

				let unsubscribeAuthState: Unsubscribe | undefined = undefined;
				const awaitOfAuthState = new Promise((resolve) => {
					unsubscribeAuthState = this.auth.onAuthStateChanged((result) => {
						if (result) {
							resolve(result)
						}
					});
				});

				awaitOfAuthState.then((result) => {

					console.log('isOffline:identity:', {result});
					if (unsubscribeAuthState) {
						(unsubscribeAuthState as Unsubscribe)();
					}

				})
			}

			if (this.auth.currentUser) {
				this.auth.currentUser.getIdTokenResult(true)
					.then((token) => {
						console.log('isOffline:identity:', {token});
					})
					.catch((error) => {
						console.log('isOffline:identity:', {error});
					});

			}

		})

		this.visibilityService.visibility$.pipe(
			this.takeUntil()
		).subscribe((visible) => {

			this.isUserOnWebSite = visible;
			if (visible) {
				this.syncManagerService.syncAll().then();
			}

		});

		this.connectWebSocket();
	}

	public ngAfterViewInit(): void {
		this.initClient();
		this.initMemberList();
		this.initAccountFrontendSettings();

		this.businessProfile$.pipe(this.takeUntil()).subscribe((businessProfile) => {
			if (!businessProfile) {
				return;
			}
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
					this.ngxLogger.info(WrapperPanelComponent.name, 'initNotificationChecker', 'TODO: IMPLEMENT REQUEST TO GET NOTIFICATION!')
				}

				this.clearNotificationChecker();
				this.initNotificationChecker();

			}, MS_ONE_MINUTE);
		}
	}

	public override ngOnDestroy(): void {
		this.store.dispatch(new CustomerActions.Init());
		this.store.dispatch(new ServiceActions.Init());
		this.store.dispatch(new MemberActions.Init());
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
					this.ngxLogger.info(WrapperPanelComponent.name, 'connectWebSocket:DisconnectSocket', {
						token,
						tenantId
					});
					return this.store.dispatch(new SocketActions.DisconnectSocket()).pipe(
						map(() => ({token, tenantId}))
					);
				})
			).subscribe({
			next: ({token, tenantId}) => {
				this.ngxLogger.info(WrapperPanelComponent.name, 'connectWebSocket:ConnectSocket', {token, tenantId});
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


