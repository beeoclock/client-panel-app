import {Routes} from '@angular/router';

export default [
	{
		path: 'list',
		loadComponent: () => import('./page/list')
	}
] as Routes;
