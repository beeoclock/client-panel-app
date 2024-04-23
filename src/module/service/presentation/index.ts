import {Routes} from "@angular/router";

export const routers = [
	{
		path: '',
		children: [
			{
				path: 'list',
				loadComponent: () => import('./page/list')
			},
		]
	}
] as Routes;
