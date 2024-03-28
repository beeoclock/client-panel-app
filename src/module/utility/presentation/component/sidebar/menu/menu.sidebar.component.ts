import {Component, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {IdentityState} from "@identity/state/identity/identity.state";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";
import {environment} from "@environment/environment";
import {EventBusTokenEnum} from "@src/event-bus-token.enum";
import {NgEventBus} from "ng-event-bus";
import {ClientState} from "@client/state/client/client.state";
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
export class MenuSidebarComponent implements OnInit {

	private readonly store = inject(Store);
	private readonly ngEventBus = inject(NgEventBus);
	private readonly sidebarService = inject(SidebarService);

	public readonly businessProfile$ = this.store.select(ClientState.item);

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

		this.businessProfile$.subscribe((item) => {
			this.initMenu();
			if (item) {
				const { bookingSettings } = item;
				const { autoBookEvent } = bookingSettings;
				if (is.false(autoBookEvent)) {
					this.menu.push({
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
				}
			}
			this.updateMenu();
		});

	}

	public initMenu(): void {

		this.menu = [];

		this.menu.push({
			order: 0,
			url: '/event/calendar-with-specialists',
			translateKey: 'sidebar.dashboard',
			icon: 'bi bi-calendar2-event',
			routerLinkActiveOptions: {
				exact: true
			}
		});
		// {
		// 	url: '/dashboard',
		// 	translateKey: 'sidebar.dashboard',
		// 	icon: 'bi bi-pie-chart',
		// 	routerLinkActiveOptions: {
		// 		exact: true
		// 	}
		// },
		this.menu.push({
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
			// items: [
			// 	{
			// 		translateKey: 'sidebar.events.list',
			// 		url: '/client/profile',
			// 		icon: 'bi bi-person',
			// 		routerLinkActiveOptions: {
			// 			exact: true
			// 		}
			// 	},
			// 	{
			// 		translateKey: 'sidebar.events.table',
			// 		url: '/client/settings',
			// 		icon: 'bi bi-gear',
			// 		routerLinkActiveOptions: {
			// 			exact: true
			// 		}
			// 	},
			// 	{
			// 		translateKey: 'sidebar.events.calendar',
			// 		url: '/identity/corridor',
			// 		icon: 'bi bi-gear',
			// 		routerLinkActiveOptions: {
			// 			exact: true
			// 		}
			// 	},
			// ]
		});
		this.menu.push({
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
		this.menu.push({
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
		this.menu.push({
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
		this.menu.push({
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
		this.menu.push({
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
		this.menu.push({
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
		// {
		//   icon: 'bi bi-person',
		//   translateKey: 'sidebar.private',
		//   routerLinkActiveOptions: {
		//     exact: true
		//   },
		//   items: [
		//     {
		//       translateKey: 'sidebar.profile',
		//       url: '/client/profile',
		//       icon: 'bi bi-person',
		//       routerLinkActiveOptions: {
		//         exact: true
		//       }
		//     },
		//     {
		//       translateKey: 'sidebar.settings',
		//       url: '/client/settings',
		//       icon: 'bi bi-gear',
		//       routerLinkActiveOptions: {
		//         exact: true
		//       }
		//     },
		//     {
		//       translateKey: 'sidebar.switch-business-client',
		//       url: '/identity/corridor',
		//       icon: 'bi bi-gear',
		//       routerLinkActiveOptions: {
		//         exact: true
		//       }
		//     },
		//   ]
		// });

		this.updateMenu();

	}

	private updateMenu(): void {
		this.menu = this.menu.sort((a, b) => a.order - b.order);
	}
}
