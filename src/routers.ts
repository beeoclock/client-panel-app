import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {clientIdResolver} from "@utility/presentation/resolver/client-id.resolver";
import {importProvidersFrom} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {EventRequestedState} from "@event/state/event-requested/event-requested.state";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";
import {CalendarWithSpecialistsState} from "@event/state/calendar-with-specialists/calendar–with-specialists.state";
import {ServiceState} from "@service/state/service/service.state";

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
						loadComponent: () => import('@ui.page/member/list/list.member.ui.page')
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
				loadChildren: () => import('@module/client/index')
			},
			{
				path: 'customer',
				loadChildren: () => import('@customer/index')
			},
			{
				path: 'service',
				providers: [
					importProvidersFrom(NgxsModule.forFeature([ServiceState])),
				],
				children: [
					{
						path: 'list',
						loadComponent: () => import('@ui.page/service/list/list.service.ui.page')
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
