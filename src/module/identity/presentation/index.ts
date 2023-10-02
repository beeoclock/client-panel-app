import {Route} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {tokenResolver} from "@utility/presentation/resolver/token.resolver";
import WrapperIdentityComponent from "@utility/presentation/component/wrapper-identity/wrapper-identity.component";

const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['/', 'identity', 'corridor']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/', 'identity']);

export const routers = [
  {
    path: '',
    canActivate: [AuthGuard],
		component: WrapperIdentityComponent,
    data: {
      authGuardPipe: redirectLoggedInToSendEmail
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./page/sign-in')
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./page/sign-up')
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./page/forgot-password')
      },
    ]
  },
  {
		path: 'confirm-email',
		loadComponent: () => import('./page/confirm-email')
  },
  {
    path: 'corridor',
    resolve: {
      clientId: tokenResolver,
    },
    loadComponent: () => import('./page/corridor')
  },
  {
    path: 'create-business',
    resolve: {
      clientId: tokenResolver,
    },
		loadComponent: () => import('./page/create-business'),
		children: [
			{
				path: '',
				loadComponent: () => import('./page/create-business/introduction')
			},
			{
				path: 'names',
				loadComponent: () => import('./page/create-business/names')
			},
			{
				path: 'industry',
				loadComponent: () => import('./page/create-business/industry')
			},
			{
				path: 'point-of-sale',
				loadComponent: () => import('./page/create-business/point-of-sale')
			},
			{
				path: 'schedules',
				loadComponent: () => import('./page/create-business/schedules')
			},
			{
				path: 'portfolio',
				loadComponent: () => import('./page/create-business/portfolio')
			},
			{
				path: 'services',
				loadComponent: () => import('./page/create-business/services')
			},
			{
				path: 'category',
				loadComponent: () => import('./page/create-business/category')
			},
			{
				path: 'service-provide-type',
				loadComponent: () => import('./page/create-business/service-provide-type')
			},
			{
				path: 'processing',
				loadComponent: () => import('./page/create-business/processing')
			}
		]
  },
] as Route[];
