import {Routes} from "@angular/router";

export const routers = [
	{
		path: 'business-profile',
		loadComponent: () => import('./page/business-profile')
	},
	{
		path: 'settings',
		loadComponent: () => import('./page/settings')
	},
	{
		path: 'notification',
		children: [
			{
				path: '',
				loadComponent: () => import('./page/notification')
			},
			{
				path: ':id',
				loadComponent: () => import('./page/notification')
			}
		]
	}
] as Routes;
