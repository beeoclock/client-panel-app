import {Routes} from "@angular/router";
import {customerDetailsResolver} from "@customer/presentation/resolver/customer.details.resolver";
import {CustomerWrapperComponent} from "@customer/presentation/component/wrapper/customer.wrapper.component";

export const routers = [
	{
		path: '',
		component: CustomerWrapperComponent,
		// resolve: {
		// 	cacheLoaded: customerCacheResolver
		// },
		children: [
			{
				path: 'list',
				// resolve: {
				// 	tableState: customerListResolver
				// },
				loadComponent: () => import('./page/list')
			},
			{
				path: 'form',
				loadComponent: () => import('./page/form'),
			},
			{
				path: ':id',
				resolve: {
					item: customerDetailsResolver
				},
				children: [
					{
						path: '',
						loadComponent: () => import('./page/details')
					},
					{
						path: 'form',
						loadComponent: () => import('./page/form'),
					}
				]
			},
		]
	}
] as Routes;
