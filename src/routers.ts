import {Routes} from '@angular/router';
import {AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {canMatchBecauseTenantId} from "@utility/can-match/can-match-because-tenant.id";
import WrapperIdentityComponent from "@utility/presentation/component/wrapper-identity/wrapper-identity.component";
import {tokenResolver} from "@utility/presentation/resolver/token.resolver";
import WrapperPanelComponent from "@utility/presentation/component/wrapper-panel/wrapper-panel.component";
import {TariffPlanStore} from "@tariffPlan/infrastructure/store/tariff-plan/tariff-plane.store";
import {GetApi} from "@tariffPlan/infrastructure/api/get/get.api";
import {GetTenantTariffPlanActualApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.actual.api";
import {GetTenantTariffPlanPagedApi} from "@tariffPlan/infrastructure/api/get/get.tenant-tariff-plan.paged.api";
import {GetItemApi} from "@tariffPlan/infrastructure/api/get/get-item.api";
import {PatchTenantTariffPlanChangeApi} from "@tariffPlan/infrastructure/api/patch/patch.tenant-tariff-plan.change.api";
import {PostStripeWebhookApi} from "@tariffPlan/infrastructure/api/post/post.stripe-webhook.api";
import {PostTenantTariffPlanCancelApi} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.cancel.api";
import {
	PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi
} from "@tariffPlan/infrastructure/api/post/post.tenant-tariff-plan.change-payment-method-checkout-session.api";

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
		providers: [
			TariffPlanStore,

			// Api
			GetApi,
			GetTenantTariffPlanActualApi,
			GetTenantTariffPlanPagedApi,
			GetItemApi,

			PatchTenantTariffPlanChangeApi,

			PostStripeWebhookApi,
			PostTenantTariffPlanCancelApi,
			PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi,
		],
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
						children: [

							{
								path: '',
								pathMatch: 'full',
								redirectTo: '/identity/corridor',
							},
							{
								path: 'tariff-plan',
								loadComponent: () => import('@page/[tenant]/tariff-plan/tariff-plan.page')
							},
							{
								path: 'member',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/[tenant]/member/list/list.member.page')
									}
								]
							},
							{
								path: 'absence',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/[tenant]/absence/list/list.absence.page')
									}
								]
							},
							{
								path: 'analytic',
								children: [
									{
										path: 'sms-used',
										loadComponent: () => import('@page/[tenant]/analytic/sms-used/sms-used.analytic.page')
									},
									{
										path: 'date-range-report',
										loadComponent: () => import('@page/[tenant]/analytic/date-range-report/date-range-report.analytic.page')
									},
								]
							},
							{
								path: 'order',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/[tenant]/order/list/list.order.page')
									}
								]
							},
							{
								path: 'event',
								children: [
									{
										path: 'requested',
										loadComponent: () => import('@page/[tenant]/event/requested/requested.event.page')
									},
									{
										path: 'calendar',
										loadComponent: () => import('@page/[tenant]/event/calendar/calendar.event.page')
									},
									{
										path: 'statistic',
										loadComponent: () => import('@page/[tenant]/event/statistic/statistic.event.page')
									},
									{
										path: 'calendar-with-specialists',
										loadComponent: () => import('@page/[tenant]/event/calendar-with-specialists/calendar-with-specialists.event.page')
									},
								]
							},
							{
								path: 'client',
								children: [
									{
										path: 'business-profile',
										loadComponent: () => import('@page/[tenant]/client/business-profile/business-profile.page')
									},
									{
										path: 'business-settings',
										loadComponent: () => import('@page/[tenant]/client/business-settings/business-settings.page')
									},
									{
										path: 'settings',
										loadComponent: () => import('@page/[tenant]/client/settings/settings.page')
									},
									{
										path: 'notification',
										children: [
											{
												path: '',
												loadComponent: () => import('@page/[tenant]/client/notification/notification.page')
											},
											{
												path: ':id',
												loadComponent: () => import('@page/[tenant]/client/notification/notification.page')
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
										loadComponent: () => import('@page/[tenant]/customer/list/list.customer.page')
									}
								]
							},
							{
								path: 'service',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@page/[tenant]/service/list/list.service.page')
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
