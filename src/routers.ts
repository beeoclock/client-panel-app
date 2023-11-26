import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {clientIdResolver} from "@utility/presentation/resolver/client-id.resolver";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['identity']);

export const routes: Routes = [
	{
		path: '',
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectUnauthorizedToLogin
		},
		resolve: {
			clientId: clientIdResolver,
		},
		children: [
			{
				path: '',
				loadChildren: () => import('@authorized/index')
			}
		]
	},
	{
		path: 'identity',
		loadChildren: () => import('@identity/index')
	},
	{
		path: '404',
		loadComponent: () => import('@utility/presentation/page/404')
	},
	{
		path: '**',
		redirectTo: '/',
	}
];
