import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {clientIdResolver} from "@utility/presentation/resolver/client-id.resolver";
import {importProvidersFrom} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";
import {CalendarWithSpecialistsState} from "@event/state/calendar-with-specialists/calendar–with-specialists.state";
import {ServiceState} from "@service/state/service/service.state";
import {CustomerState} from "@customer/state/customer/customer.state";

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
				path: 'user',
				loadChildren: () => import('@user/presentation')
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
