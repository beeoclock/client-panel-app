import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import IdentityRouterOutletComponent from "@identity/identity.router-outlet.component";
import {tokenResolver} from "@shared/presentation/resolver/token.resolver";

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
						loadComponent: () => import('@identity/identity/presentation/ui/page/sign-in/sign-in.identity.page')
					},
					{
						path: 'sign-up',
						loadComponent: () => import('@identity/identity/presentation/ui/page/sign-up/sign-up.identity.page')
					},
					{
						path: 'confirm-invitation',
						loadComponent: () => import('@identity/identity/presentation/ui/page/confirm-invitation/confirm-invitation.identity.page')
					},
					{
						path: 'forgot-password',
						loadComponent: () => import('@identity/identity/presentation/ui/page/forgot-password/forgot-password.identity.page')
					},
				]
			},
			{
				path: 'confirm-email',
				loadComponent: () => import('@identity/identity/presentation/ui/page/confirm-email/confirm-email.identity.page')
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
				loadComponent: () => import('@identity/identity/presentation/ui/page/corridor/corridor.identity.page')
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
				loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/create-business.identity.page'),
				children: [
					{
						path: '',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/introduction/introduction.create-business.identity.page'),
					},
					{
						path: 'names',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/names/names.create-business.identity.page'),
					},
					{
						path: 'industry',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/industry/industry.create-business.identity.page'),
					},
					{
						path: 'point-of-sale',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/point-of-sale/point-of-sale.create-business.identity.page'),
					},
					{
						path: 'schedules',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/schedules/schedules.create-business.identity.page'),
					},
					{
						path: 'languages',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/languages/languages.create-business.identity.page'),
					},
					{
						path: 'portfolio',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/portfolio/portfolio.create-business.identity.page'),
					},
					{
						path: 'services',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/services/services.create-business.identity.page'),
					},
					{
						path: 'category',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/category/category.create-business.identity.page'),
					},
					{
						path: 'service-provide-type',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/service-provide-type/service-provide-type.create-business.identity.page'),
					},
					{
						path: 'processing',
						loadComponent: () => import('@identity/identity/presentation/ui/page/create-business/processing/processing.create-business.identity.page'),
					}
				],
			},
		]
	},
];
