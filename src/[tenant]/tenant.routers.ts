import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {canMatchBecauseTenantId} from "@utility/can-match/can-match-because-tenant.id";
import TenantRouterOutletComponent from "@[tenant]/tenant.router-outlet.component";
import {tariffPlanItemsResolver} from "@tariffPlan/presentation/resolver/tariff-plan-items.resolver";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/', 'identity']);

export const tenantRouters: Routes = [
	{
		path: '',
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectUnauthorizedToLogin
		},
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: '/identity/corridor',
			},
			{
				path: ':tenantId',
				canMatch: [canMatchBecauseTenantId],
				children: [
					{
						path: '',
						component: TenantRouterOutletComponent,
						children: [

							{
								path: '',
								pathMatch: 'full',
								redirectTo: '/identity/corridor',
							},
							{
								path: 'tariff-plan',
								children: [
									{
										path: 'overview',
										resolve: {
											tariffPlanItems: tariffPlanItemsResolver,
										},
										loadComponent: () => import('@page/tariff-plan/tariff-plan.page')
									}
								]
							},
							{
								path: 'member',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/member/list/list.member.page')
									}
								]
							},
							{
								path: 'absence',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/absence/list/list.absence.page')
									}
								]
							},
							{
								path: 'analytic',
								children: [
									{
										path: 'sms-used',
										loadComponent: () => import('@page/analytic/sms-used/sms-used.analytic.page')
									},
									{
										path: 'date-range-report',
										loadComponent: () => import('@page/analytic/date-range-report/date-range-report.analytic.page')
									},
								]
							},
							{
								path: 'order',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/order/list/list.order.page')
									}
								]
							},
							{
								path: 'event',
								children: [
									{
										path: 'requested',
										loadComponent: () => import('@page/event/requested/requested.event.page')
									},
									{
										path: 'calendar',
										loadComponent: () => import('@page/event/calendar/calendar.event.page')
									},
									{
										path: 'statistic',
										loadComponent: () => import('@page/event/statistic/statistic.event.page')
									},
									{
										path: 'calendar-with-specialists',
										loadComponent: () => import('@page/event/calendar-with-specialists/calendar-with-specialists.event.page')
									},
								]
							},
							{
								path: 'client',
								children: [
									{
										path: 'business-profile',
										loadComponent: () => import('@page/client/business-profile/business-profile.page')
									},
									{
										path: 'business-settings',
										loadComponent: () => import('@page/client/business-settings/business-settings.page')
									},
									{
										path: 'settings',
										loadComponent: () => import('@page/client/settings/settings.page')
									},
									{
										path: 'notification',
										children: [
											{
												path: '',
												loadComponent: () => import('@page/client/notification/notification.page')
											},
											{
												path: ':id',
												loadComponent: () => import('@page/client/notification/notification.page')
											}
										]
									}
								]
							},
							{
								path: 'customer',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/customer/list/list.customer.page')
									}
								]
							},
							{
								path: 'service',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/service/list/list.service.page')
									}
								]
							},
						]
					}
				]
			}
		]
	},
];
