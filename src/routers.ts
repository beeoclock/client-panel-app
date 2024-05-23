import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {clientIdResolver} from "@utility/presentation/resolver/client-id.resolver";
import {importProvidersFrom} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";
import {CalendarWithSpecialistsState} from "@event/state/calendar-with-specialists/calendar–with-specialists.state";
import {ServiceState} from "@service/state/service/service.state";
import {CustomerState} from "@customer/state/customer/customer.state";
import WrapperIdentityComponent from "@utility/presentation/component/wrapper-identity/wrapper-identity.component";
import {tokenResolver} from "@utility/presentation/resolver/token.resolver";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['identity']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['/', 'identity', 'corridor']);

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
		providers: [
			importProvidersFrom(NgxsModule.forFeature([EventRequestedState])),
		],
		component: WrapperPanelComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/identity',
			},
			{
				path: 'dashboard',
				providers: [
					importProvidersFrom(NgxsModule.forFeature([CalendarWithSpecialistsState])),
				],
				loadChildren: () => import('@event/index')
			},
			{
				path: 'member',
				children: [
					{
						path: 'list',
						loadComponent: () => import('@page/member/list/list.member.ui.page')
					}
				]
			},
			{
				path: 'event',
				loadChildren: () => import('@event/index')
			},
			{
				path: 'client',
				children: [
					{
						path: 'business-profile',
						loadComponent: () => import('@page/client/business-profile/business-profile.ui.page')
					},
					{
						path: 'business-settings',
						loadComponent: () => import('@page/client/business-settings/business-settings.ui.page')
					},
					{
						path: 'settings',
						loadComponent: () => import('@page/client/settings/settings.ui.page')
					},
					{
						path: 'notification',
						children: [
							{
								path: '',
								loadComponent: () => import('@page/client/notification/notification.ui.page')
							},
							{
								path: ':id',
								loadComponent: () => import('@page/client/notification/notification.ui.page')
							}
						]
					}
				]
			},
			{
				path: 'customer',
				providers: [
					importProvidersFrom(NgxsModule.forFeature([CustomerState])),
				],
				children: [
					{
						path: 'list',
						loadComponent: () => import('@page/customer/list/list.customer.ui.page')
					}
				]
			},
			{
				path: 'service',
				providers: [
					importProvidersFrom(NgxsModule.forFeature([ServiceState])),
				],
				children: [
					{
						path: 'list',
						loadComponent: () => import('@page/service/list/list.service.ui.page')
					}
				]
			},
		]
	},
	{
		path: 'identity',
		children: [
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
						loadComponent: () => import('@page/identity/sign-in/sign-in.identity.ui.page')
					},
					{
						path: 'sign-up',
						loadComponent: () => import('@page/identity/sign-up/sign-up.identity.ui.page')
					},
					{
						path: 'confirm-invitation',
						loadComponent: () => import('@page/identity/confirm-invitation/confirm-invitation.identity.ui.page')
					},
					{
						path: 'forgot-password',
						loadComponent: () => import('@page/identity/forgot-password/forgot-password.identity.ui.page')
					},
				]
			},
			{
				path: 'confirm-email',
				loadComponent: () => import('@page/identity/confirm-email/confirm-email.identity.ui.page')
			},
			{
				path: 'corridor',
				resolve: {
					clientId: tokenResolver,
				},
				loadComponent: () => import('@page/identity/corridor/corridor.identity.ui.page')
			},
			{
				path: 'create-business',
				resolve: {
					clientId: tokenResolver,
				},
				loadComponent: () => import('@page/identity/create-business/create-business.identity.ui.page'),
				children: [
					{
						path: '',
						loadComponent: () => import('@page/identity/create-business/introduction/introduction.create-business.identity.ui.page'),
					},
					{
						path: 'names',
						loadComponent: () => import('@page/identity/create-business/names/names.create-business.identity.ui.page'),
					},
					{
						path: 'industry',
						loadComponent: () => import('@page/identity/create-business/industry/industry.create-business.identity.ui.page'),
					},
					{
						path: 'point-of-sale',
						loadComponent: () => import('@page/identity/create-business/point-of-sale/point-of-sale.create-business.identity.ui.page'),
					},
					{
						path: 'schedules',
						loadComponent: () => import('@page/identity/create-business/schedules/schedules.create-business.identity.ui.page'),
					},
					{
						path: 'languages',
						loadComponent: () => import('@page/identity/create-business/languages/languages.create-business.identity.ui.page'),
					},
					{
						path: 'portfolio',
						loadComponent: () => import('@page/identity/create-business/portfolio/portfolio.create-business.identity.ui.page'),
					},
					{
						path: 'services',
						loadComponent: () => import('@page/identity/create-business/services/services.create-business.identity.ui.page'),
					},
					{
						path: 'category',
						loadComponent: () => import('@page/identity/create-business/category/category.create-business.identity.ui.page'),
					},
					{
						path: 'service-provide-type',
						loadComponent: () => import('@page/identity/create-business/service-provide-type/service-provide-type.create-business.identity.ui.page'),
					},
					{
						path: 'processing',
						loadComponent: () => import('@page/identity/create-business/processing/processing.create-business.identity.ui.page'),
					}
				]
			},
		]
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
