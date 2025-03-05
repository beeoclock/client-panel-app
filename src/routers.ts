import {Routes} from '@angular/router';

export const routes: Routes = [
	{
		path: 'identity',
		loadChildren: () => import('@identity/identity.module'),
	},
	{
		path: '404',
		loadComponent: () => import('@utility/presentation/page/404')
	},
	{
		path: '',
		loadChildren: () => import('@[tenant]/tenant.module'),
	},
	{
		path: '**',
		redirectTo: '/',
	}
];
