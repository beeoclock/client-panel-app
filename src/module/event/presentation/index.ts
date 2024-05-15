import {Routes} from "@angular/router";

export const routers = [
	{
		path: '',
		children: [
			{
				path: 'list',
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
				path: 'statistic',
				loadComponent: () => import('./page/statistic'),
			},
			{
				path: 'calendar-with-specialists',
				loadComponent: () => import('./page/calendar-with-specialists'),
			},
		]
	}
] as Routes;
