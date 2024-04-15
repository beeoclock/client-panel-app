import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {combineLatest, firstValueFrom} from "rxjs";
import {IdentityState} from "@identity/state/identity/identity.state";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";
import {environment} from "@environment/environment";
import {EventBusTokenEnum} from "@src/event-bus-token.enum";
import {NgEventBus} from "ng-event-bus";
import {ClientState} from "@client/state/client/client.state";
import {PermissionIdentitySelector} from "@identity/state/identity/permission.identity.selector";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "thiis";

interface IMenuItem {
	order: number;
	url?: string;
	icon?: string;
	badge?: string;
	translateKey: string;
	target?: '_blank';
	disabled?: boolean;
	routerLinkActiveOptions: {
		exact: boolean;
	} | IsActiveMatchOptions;
	items?: IMenuItem[]
}

@Component({
	standalone: true,
	selector: 'utility-sidebar-menu-component',
	templateUrl: './menu.sidebar.component.html',
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgIf,
		NgForOf,
		RouterLink,
		RouterLinkActive,
		TranslateModule
	],
})
export class MenuSidebarComponent extends Reactive implements OnInit {

	private readonly store = inject(Store);
	private readonly ngEventBus = inject(NgEventBus);
	private readonly sidebarService = inject(SidebarService);

	public readonly autoBookEvent$ = this.store.select(ClientState.autoBookEvent);

	private readonly addMenuItem = {
		calendarWithSpecialists: () => {
			this.pushMenuItem({
				order: 0,
				url: '/event/calendar-with-specialists',
				translateKey: 'sidebar.dashboard',
				icon: 'bi bi-calendar2-event',
				routerLinkActiveOptions: {
					exact: true
				}
			});
		},
		request: () => {
			this.pushMenuItem({
				order: 2,
				translateKey: 'sidebar.requested',
				icon: 'bi bi-calendar-plus',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				},
				url: '/event/requested',
			});
		},
		customer: () => {
			this.pushMenuItem({
				order: 4,
				url: '/customer/list',
				translateKey: 'sidebar.customers',
				icon: 'bi bi-person-vcard',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				}
			});
		},
		member: () => {
			this.pushMenuItem({
				order: 5,
				url: '/member/list',
				translateKey: 'sidebar.members',
				icon: 'bi bi-people',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				}
			});
		},
		event: () => {
			this.pushMenuItem({
				order: 1,
				translateKey: 'sidebar.events',
				icon: 'bi bi-table',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				},
				url: '/event/list',
			});
		},
		calendar: () => {
			this.pushMenuItem({
				order: 3,
				translateKey: 'sidebar.calendar',
				icon: 'bi bi-calendar-week',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				},
				url: '/event/calendar',
			});
		},
		service: () => {
			this.pushMenuItem({
				order: 6,
				url: '/service/list',
				translateKey: 'sidebar.services',
				icon: 'bi bi-shop-window',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				}
			});
		},
		businessProfile: () => {
			this.pushMenuItem({
				order: 7,
				url: '/client/business-profile',
				translateKey: 'sidebar.businessProfile',
				icon: 'bi bi-buildings',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				}
			});
		},
		businessSettings: () => {
			this.pushMenuItem({
				order: 8,
				url: '/client/business-settings',
				translateKey: 'sidebar.businessSettings',
				icon: 'bi bi-building-gear',
				routerLinkActiveOptions: {
					paths: "subset",
					matrixParams: "ignored",
					queryParams: "ignored",
					fragment: "ignored",
				}
			});
		}
	}

	private readonly removeMenuItem = {
		calendarWithSpecialists: () => {
			this.deleteMenuItemByTranslateKey('sidebar.dashboard');
		},
		request: () => {
			this.deleteMenuItemByTranslateKey('sidebar.requested');
		},
		customer: () => {
			this.deleteMenuItemByTranslateKey('sidebar.customers')
		},
		member: () => {
			this.deleteMenuItemByTranslateKey('sidebar.members')
		},
		event: () => {
			this.deleteMenuItemByTranslateKey('sidebar.events')
		},
		calendar: () => {
			this.deleteMenuItemByTranslateKey('sidebar.calendar')
		},
		service: () => {
			this.deleteMenuItemByTranslateKey('sidebar.services')
		},
		businessProfile: () => {
			this.deleteMenuItemByTranslateKey('sidebar.businessProfile')
		},
		businessSettings: () => {
			this.deleteMenuItemByTranslateKey('sidebar.businessSettings')
		}
	}

	public detectAutoClose() {
		this.sidebarService.detectAutoClose();
	}

	public menu: IMenuItem[] = [];

	public async goToPublicPage(): Promise<void> {

		let path;

		path = await firstValueFrom(this.store.select(ClientState.username));

		if (!path) {

			path = await firstValueFrom(this.store.select(IdentityState.clientId));

		}

		const link = `${environment.urls.publicPageOrigin}/${path}`;
		window.open(link, '_blank');

	}

	public ngOnInit(): void {

		// TODO change bus event on state (ngxs)
		this.ngEventBus
			.on(EventBusTokenEnum.SIDE_BAR_EVENT_REQUESTED_BADGE)
			.subscribe((event) => {
				const badge = event.data as string;
				const menuItem = this.menu.find((item) => item.translateKey === 'sidebar.requested');
				if (menuItem) {
					menuItem.badge = badge;
				}
			});

		combineLatest([
			this.autoBookEvent$,
			this.store.select(PermissionIdentitySelector.hasPermission('event', 'read'))
		]).pipe(this.takeUntil()).subscribe(({0: autoBookEvent, 1: hasPermission}) => {

			if (hasPermission) {

				this.addMenuItem.event();
				this.addMenuItem.calendar();
				this.addMenuItem.calendarWithSpecialists();

				is.false(autoBookEvent) ? this.addMenuItem.request() : this.removeMenuItem.request();

			} else {

				this.removeMenuItem.event();
				this.removeMenuItem.calendar();
				this.removeMenuItem.calendarWithSpecialists();
				this.removeMenuItem.request();

			}

		});

		this.store.select(PermissionIdentitySelector.hasPermission('customer', 'read'))
			.pipe(this.takeUntil())
			.subscribe((hasPermission) => {
				hasPermission && this.addMenuItem.customer();
				!hasPermission && this.removeMenuItem.customer();
		});

		this.store.select(PermissionIdentitySelector.hasPermission('member', 'read'))
			.pipe(this.takeUntil())
			.subscribe((hasPermission) => {
				hasPermission && this.addMenuItem.member();
				!hasPermission && this.removeMenuItem.member();
		});

		this.store.select(PermissionIdentitySelector.hasPermission('service', 'read'))
			.pipe(this.takeUntil())
			.subscribe((hasPermission) => {
				hasPermission && this.addMenuItem.service();
				!hasPermission && this.removeMenuItem.service();
		});

		this.store.select(PermissionIdentitySelector.hasPermission('businessProfileSettings', 'read'))
			.pipe(this.takeUntil())
			.subscribe((hasPermission) => {
				hasPermission && this.addMenuItem.businessProfile();
				!hasPermission && this.removeMenuItem.businessProfile();
		});

		this.store.select(PermissionIdentitySelector.hasPermission('businessSetting', 'read'))
			.pipe(this.takeUntil())
			.subscribe((hasPermission) => {
				hasPermission && this.addMenuItem.businessSettings();
				!hasPermission && this.removeMenuItem.businessSettings();
		});

	}

	private updateMenu(): void {
		this.menu = this.menu.sort((a, b) => a.order - b.order);
	}

	private deleteMenuItemByTranslateKey(translateKey: string): void {
		this.menu = this.menu.filter((item) => item.translateKey !== translateKey);
		this.updateMenu();
	}

	private pushMenuItem(menuItem: IMenuItem): void {

		// Check if exist
		if (this.menuItemExist(menuItem.translateKey)) {
			return;
		}

		this.menu.push(menuItem);
		this.updateMenu();

	}

	private menuItemExist(target: string) {
		return this.menu.some(({translateKey}) => translateKey === target);
	}
}
