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
	visible: boolean;
	beta?: boolean;
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

	public readonly requestedMenuItem: IMenuItem = {
		order: 2,
		translateKey: 'sidebar.requested',
		icon: 'bi bi-calendar-plus',
		visible: false,
		routerLinkActiveOptions: {
			paths: "subset",
			matrixParams: "ignored",
			queryParams: "ignored",
			fragment: "ignored",
		},
		url: '/event/requested',
	};

	public async goToPublicPage(): Promise<void> {

		let path;

		path = await firstValueFrom(this.store.select(ClientState.username));

		if (!path) {

			path = await firstValueFrom(this.store.select(IdentityState.clientId));

		}

		const link = `${environment.urls.publicPageOrigin}/${path}`;
		window.open(link, '_blank');

	}

	public trackByUrl(index: number, event: IMenuItem) {
		return event.url;
	}

	public ngOnInit(): void {
		// TODO change bus event on state (ngxs)
		this.ngEventBus
			.on(EventBusTokenEnum.SIDE_BAR_EVENT_REQUESTED_BADGE)
			.subscribe((event) => {
				const badge = event.data as string;
				this.requestedMenuItem.badge = badge;
			});

		this.businessProfile$.subscribe((item) => {
			this.initMenu();
			if (item) {
				const { bookingSettings } = item;
				const { autoBookOrder } = bookingSettings;
				this.requestedMenuItem.visible = is.false(autoBookOrder);
			}
			this.updateMenu();
		});

	}

	public initMenu(): void {

		this.menu = [
			this.requestedMenuItem
		];

		// this.menu.push({
		// 	order: 0,
		// 	url: '/event/calendar-with-specialists',
		// 	translateKey: 'sidebar.dashboard',
		// 	icon: 'bi bi-calendar2-event',
		// 	routerLinkActiveOptions: {
		// 		exact: true
		// 	}
		// });
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
			translateKey: 'sidebar.calendar.label',
			icon: 'bi bi-calendar2-event',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			},
			url: '/event/list',
			items: [
				{
					translateKey: 'sidebar.calendar.withSpecialists.label',
					url: '/event/calendar-with-specialists',
					icon: 'bi bi-person-badge',
					routerLinkActiveOptions: {
						exact: true
					},
					visible: true,
					order: 0
				},
				{
					url: '/event/calendar',
					translateKey: 'sidebar.calendar.ordinary.label',
					icon: 'bi bi-calendar-week',
					routerLinkActiveOptions: {
						exact: true
					},
					visible: true,
					order: 1
				},
			]
		});
		// this.menu.push({
		// 	order: 3,
		// 	url: '/event/calendar',
		// 	translateKey: 'sidebar.calendar',
		// 	icon: 'bi bi-calendar-week',
		// 	routerLinkActiveOptions: {
		// 		paths: "subset",
		// 		matrixParams: "ignored",
		// 		queryParams: "ignored",
		// 		fragment: "ignored",
		// 	},
		// });
		this.menu.push({
			order: 4,
			url: '/event/statistic',
			translateKey: 'sidebar.statistic',
			icon: 'bi bi-bar-chart',
			beta: true,
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 5,
			url: '/customer/list',
			translateKey: 'sidebar.customers',
			icon: 'bi bi-person-vcard',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 6,
			url: '/order/list',
			translateKey: 'sidebar.order',
			icon: 'bi bi-cart',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 7,
			url: '/absence/list',
			translateKey: 'sidebar.absence',
			icon: 'bi bi-calendar2-x',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 8,
			url: '/member/list',
			translateKey: 'sidebar.members',
			visible: true,
			icon: 'bi bi-people',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 9,
			url: '/service/list',
			translateKey: 'sidebar.services',
			icon: 'bi bi-emoji-smile',
			visible: true,
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 10,
			url: '/client/business-profile',
			translateKey: 'sidebar.businessProfile',
			visible: true,
			icon: 'bi bi-buildings',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		});
		this.menu.push({
			order: 11,
			url: '/client/business-settings',
			translateKey: 'sidebar.businessSettings',
			icon: 'bi bi-building-gear',
			visible: true,
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
