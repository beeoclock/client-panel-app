import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import IdentityRouterOutletComponent from "@identity/identity.router-outlet.component";
import {tokenResolver} from "@utility/presentation/resolver/token.resolver";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/', 'identity']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['/', 'identity', 'corridor']);

export const identityRouters: Routes = [
	{
		path: '',
		children: [
			{
				path: '',
				canActivate: [AuthGuard],
				component: IdentityRouterOutletComponent,
				data: {
					authGuardPipe: redirectLoggedInToSendEmail
				},
				children: [
					{
						path: '',
						loadComponent: () => import('@src/identity/page/sign-in/sign-in.identity.page')
					},
					{
						path: 'sign-up',
						loadComponent: () => import('@src/identity/page/sign-up/sign-up.identity.page')
					},
					{
						path: 'confirm-invitation',
						loadComponent: () => import('@src/identity/page/confirm-invitation/confirm-invitation.identity.page')
					},
					{
						path: 'forgot-password',
						loadComponent: () => import('@src/identity/page/forgot-password/forgot-password.identity.page')
					},
				]
			},
			{
				path: 'confirm-email',
				loadComponent: () => import('@src/identity/page/confirm-email/confirm-email.identity.page')
			},
			{
				path: 'corridor',
				canActivate: [AuthGuard],
				data: {
					authGuardPipe: redirectUnauthorizedToLogin
				},
				resolve: {
					token: tokenResolver,
				},
				loadComponent: () => import('@src/identity/page/corridor/corridor.identity.page')
			},
			{
				path: 'create-business',
				canActivate: [AuthGuard],
				data: {
					authGuardPipe: redirectUnauthorizedToLogin
				},
				resolve: {
					token: tokenResolver,
				},
				loadComponent: () => import('@src/identity/page/create-business/create-business.identity.page'),
				children: [
					{
						path: '',
						loadComponent: () => import('@src/identity/page/create-business/introduction/introduction.create-business.identity.page'),
					},
					{
						path: 'names',
						loadComponent: () => import('@src/identity/page/create-business/names/names.create-business.identity.page'),
					},
					{
						path: 'industry',
						loadComponent: () => import('@src/identity/page/create-business/industry/industry.create-business.identity.page'),
					},
					{
						path: 'point-of-sale',
						loadComponent: () => import('@src/identity/page/create-business/point-of-sale/point-of-sale.create-business.identity.page'),
					},
					{
						path: 'schedules',
						loadComponent: () => import('@src/identity/page/create-business/schedules/schedules.create-business.identity.page'),
					},
					{
						path: 'languages',
						loadComponent: () => import('@src/identity/page/create-business/languages/languages.create-business.identity.page'),
					},
					{
						path: 'portfolio',
						loadComponent: () => import('@src/identity/page/create-business/portfolio/portfolio.create-business.identity.page'),
					},
					{
						path: 'services',
						loadComponent: () => import('@src/identity/page/create-business/services/services.create-business.identity.page'),
					},
					{
						path: 'category',
						loadComponent: () => import('@src/identity/page/create-business/category/category.create-business.identity.page'),
					},
					{
						path: 'service-provide-type',
						loadComponent: () => import('@src/identity/page/create-business/service-provide-type/service-provide-type.create-business.identity.page'),
					},
					{
						path: 'processing',
						loadComponent: () => import('@src/identity/page/create-business/processing/processing.create-business.identity.page'),
					}
				],
			},
		]
	},
];
