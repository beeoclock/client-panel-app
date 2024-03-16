import {Routes} from "@angular/router";
import {eventDetailsResolver} from "@event/presentation/resolver/event.details.resolver";
import {eventServiceResolver} from "@event/presentation/resolver/event.service.resolver";
import {eventCustomerResolver} from "@event/presentation/resolver/event.customer.resolver";

export const routers = [
	{
		path: '',
		// resolve: {
		// 	cacheLoaded: eventCacheResolver
		// },
		children: [
			{
				path: 'list',
				// resolve: {
				// 	tableState: eventListResolver
				// },
				loadComponent: () => import('./page/list')
			},
			{
				path: 'requested',
				loadComponent: () => import('./page/requested')
			},
			{
				path: 'calendar',
				loadComponent: () => import('./page/calendar'),
			},
			{
				path: 'calendar-with-specialists',
				loadComponent: () => import('./page/calendar-with-specialists'),
			},
			{
				path: 'form',
				resolve: {
					service: eventServiceResolver,
					customer: eventCustomerResolver,
				},
				loadComponent: () => import('./page/form'),
			},
			{
				path: ':id',
				resolve: {
					item: eventDetailsResolver
				},
				children: [
					{
						path: '',
						loadComponent: () => import('./page/details')
					},
					{
						path: 'form',
						loadComponent: () => import('./page/form'),
					},
					{
						path: 'repeat',
						data: {
							repeat: true
						},
						loadComponent: () => import('./page/form'),
					}
				]
			},
		]
	}
] as Routes;
