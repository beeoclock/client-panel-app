import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {canMatchBecauseTenantId} from "@utility/can-match/can-match-because-tenant.id";
import WrapperIdentityComponent from "@utility/presentation/component/wrapper-identity/wrapper-identity.component";
import {tokenResolver} from "@utility/presentation/resolver/token.resolver";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";
import {importProvidersFrom} from "@angular/core";
import {NgxsModule} from "@ngxs/store";
import {AbsenceState} from "@absence/infrastructure/state/absence/absence.state";
import {SmsUsedAnalyticState} from "@module/analytic/infrastructure/store/sms-used/sms-used.analytic.state";
import {
	DateRangeReportAnalyticState
} from "@module/analytic/infrastructure/store/date-range-report/date-range-report.analytic.state";
import {EventState} from "@event/infrastructure/state/event/event.state";
import {OrderState} from "@order/infrastructure/state/order/order.state";
import {CalendarState} from "@event/infrastructure/state/calendar/calendar.state";
import {
	CalendarWithSpecialistsState
} from "@event/infrastructure/state/calendar-with-specialists/calendar–with-specialists.state";
import {ServiceState} from "@service/infrastructure/state/service/service.state";
import {PeerCustomerOrderState} from "@order/infrastructure/state/peer-customer/peer-customer.order.state";
import {CustomerState} from "@customer/infrastructure/state/customer/customer.state";
import {MemberState} from "@member/infrastructure/state/member/member.state";
import {ClientState} from "@client/infrastructure/state/client/client.state";
import {PaymentState} from "@module/payment/infrastructure/state/payment/payment.state";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/', 'identity']);
const redirectLoggedInToSendEmail = () => redirectLoggedInTo(['/', 'identity', 'corridor']);

export const routes: Routes = [
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
						loadComponent: () => import('@page/identity/sign-in/sign-in.identity.page')
					},
					{
						path: 'sign-up',
						loadComponent: () => import('@page/identity/sign-up/sign-up.identity.page')
					},
					{
						path: 'confirm-invitation',
						loadComponent: () => import('@page/identity/confirm-invitation/confirm-invitation.identity.page')
					},
					{
						path: 'forgot-password',
						loadComponent: () => import('@page/identity/forgot-password/forgot-password.identity.page')
					},
				]
			},
			{
				path: 'confirm-email',
				loadComponent: () => import('@page/identity/confirm-email/confirm-email.identity.page')
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
				loadComponent: () => import('@page/identity/corridor/corridor.identity.page')
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
				loadComponent: () => import('@page/identity/create-business/create-business.identity.page'),
				children: [
					{
						path: '',
						loadComponent: () => import('@page/identity/create-business/introduction/introduction.create-business.identity.page'),
					},
					{
						path: 'names',
						loadComponent: () => import('@page/identity/create-business/names/names.create-business.identity.page'),
					},
					{
						path: 'industry',
						loadComponent: () => import('@page/identity/create-business/industry/industry.create-business.identity.page'),
					},
					{
						path: 'point-of-sale',
						loadComponent: () => import('@page/identity/create-business/point-of-sale/point-of-sale.create-business.identity.page'),
					},
					{
						path: 'schedules',
						loadComponent: () => import('@page/identity/create-business/schedules/schedules.create-business.identity.page'),
					},
					{
						path: 'languages',
						loadComponent: () => import('@page/identity/create-business/languages/languages.create-business.identity.page'),
					},
					{
						path: 'portfolio',
						loadComponent: () => import('@page/identity/create-business/portfolio/portfolio.create-business.identity.page'),
					},
					{
						path: 'services',
						loadComponent: () => import('@page/identity/create-business/services/services.create-business.identity.page'),
					},
					{
						path: 'category',
						loadComponent: () => import('@page/identity/create-business/category/category.create-business.identity.page'),
					},
					{
						path: 'service-provide-type',
						loadComponent: () => import('@page/identity/create-business/service-provide-type/service-provide-type.create-business.identity.page'),
					},
					{
						path: 'processing',
						loadComponent: () => import('@page/identity/create-business/processing/processing.create-business.identity.page'),
					}
				],
				// children: [
				// 	{
				// 		path: ':tenantId', // tenantId of new business context
				// 		children: [
				// 			{
				// 				path: '',
				// 				loadComponent: () => import('@page/identity/create-business/introduction/introduction.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'names',
				// 				loadComponent: () => import('@page/identity/create-business/names/names.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'industry',
				// 				loadComponent: () => import('@page/identity/create-business/industry/industry.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'point-of-sale',
				// 				loadComponent: () => import('@page/identity/create-business/point-of-sale/point-of-sale.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'schedules',
				// 				loadComponent: () => import('@page/identity/create-business/schedules/schedules.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'languages',
				// 				loadComponent: () => import('@page/identity/create-business/languages/languages.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'portfolio',
				// 				loadComponent: () => import('@page/identity/create-business/portfolio/portfolio.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'services',
				// 				loadComponent: () => import('@page/identity/create-business/services/services.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'category',
				// 				loadComponent: () => import('@page/identity/create-business/category/category.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'service-provide-type',
				// 				loadComponent: () => import('@page/identity/create-business/service-provide-type/service-provide-type.create-business.identity.page'),
				// 			},
				// 			{
				// 				path: 'processing',
				// 				loadComponent: () => import('@page/identity/create-business/processing/processing.create-business.identity.page'),
				// 			}
				// 		]
				// 	}
				// ]
			},
		]
	},
	{
		path: '404',
		loadComponent: () => import('@utility/presentation/page/404')
	},
	{
		path: '',
		canActivate: [AuthGuard],
		data: {
			authGuardPipe: redirectUnauthorizedToLogin
		},
		// providers: [
		//     importProvidersFrom(NgxsModule.forFeature([EventRequestedState])),
		// ],
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
						component: WrapperPanelComponent,
						providers: [
							importProvidersFrom(NgxsModule.forFeature([
								DateRangeReportAnalyticState,
								PeerCustomerOrderState,
								CustomerState,
								ServiceState,
								AbsenceState,
								MemberState,
								OrderState,
								ClientState,
								PaymentState,
							]))
						],
						children: [

							{
								path: '',
								pathMatch: 'full',
								redirectTo: '/identity/corridor',
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
										providers: [
											importProvidersFrom(NgxsModule.forFeature([SmsUsedAnalyticState])),
										],
										loadComponent: () => import('@page/analytic/sms-used/sms-used.analytic.page')
									},
									{
										path: 'date-range-report',
										providers: [
											importProvidersFrom(NgxsModule.forFeature([DateRangeReportAnalyticState])),
										],
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
								providers: [
									importProvidersFrom(NgxsModule.forFeature([EventState, DateRangeReportAnalyticState])),
								],
								children: [
									{
										path: 'requested',
										loadComponent: () => import('@page/event/requested/requested.event.page')
									},
									{
										path: 'calendar',
										providers: [
											importProvidersFrom(NgxsModule.forFeature([CalendarState])),
										],
										loadComponent: () => import('@page/event/calendar/calendar.event.page')
									},
									{
										path: 'statistic',
										providers: [
											// importProvidersFrom(NgxsModule.forFeature([StatisticState])),
										],
										loadComponent: () => import('@page/event/statistic/statistic.event.page')
									},
									{
										path: 'calendar-with-specialists',
										providers: [
											importProvidersFrom(NgxsModule.forFeature([CalendarWithSpecialistsState])),
										],
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
	{
		path: '**',
		redirectTo: '/',
	}
];
