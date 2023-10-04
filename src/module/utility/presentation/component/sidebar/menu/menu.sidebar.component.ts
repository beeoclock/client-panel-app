import {Component, inject, ViewEncapsulation} from '@angular/core';
import {IsActiveMatchOptions, RouterLink, RouterLinkActive} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {Store} from "@ngxs/store";
import {firstValueFrom} from "rxjs";
import {IdentityState} from "@identity/state/identity/identity.state";
import {SidebarService} from "@utility/presentation/component/sidebar/sidebar.service";
import {SIDEBAR_ID} from "@src/token";
import {environment} from "@environment/environment";

interface IMenuItem {
	url?: string;
	icon?: string;
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
export class MenuSidebarComponent {

	public readonly sidebarId = inject(SIDEBAR_ID);
	private readonly store = inject(Store);
	private readonly sidebarService = inject(SidebarService);

	public readonly menu: IMenuItem[] = [
		{
			url: '/dashboard',
			translateKey: 'sidebar.dashboard',
			icon: 'bi bi-pie-chart',
			routerLinkActiveOptions: {
				exact: true
			}
		},
		{
			translateKey: 'sidebar.events',
			icon: 'bi bi-calendar2-week',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			},
			url: '/event',
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
		},
		{
			url: '/customer',
			translateKey: 'sidebar.customers',
			icon: 'bi bi-person-vcard',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		},
		// {
		//   url: '/member',
		//   translateKey: 'sidebar.members',
		//   icon: 'bi bi-people',
		//   routerLinkActiveOptions: {
		//     paths: "subset",
		//     matrixParams: "ignored",
		//     queryParams: "ignored",
		//     fragment: "ignored",
		//   }
		// },
		{
			url: '/service',
			translateKey: 'sidebar.services',
			icon: 'bi bi-shop-window',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		},
		{
			url: '/client/business-profile',
			translateKey: 'sidebar.businessProfile',
			icon: 'bi bi-buildings',
			routerLinkActiveOptions: {
				paths: "subset",
				matrixParams: "ignored",
				queryParams: "ignored",
				fragment: "ignored",
			}
		},
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
		// }
	];

	public async goToPublicPage(): Promise<void> {

		const clientId = await firstValueFrom(this.store.select(IdentityState.clientId));
		const link = `${environment.urls.publicPageOrigin}/${clientId}`;
		window.open(link, '_blank');

	}
}
