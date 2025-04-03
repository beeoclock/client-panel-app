import {Routes} from '@angular/router';
import {AuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {canMatchBecauseTenantId} from "@shared/can-match/can-match-because-tenant.id";
import TenantRouterOutletComponent from "@tenant/tenant.router-outlet.component";
import {tariffPlanActualResolver} from "@tenant/tariff-plan-history/presentation/resolver/tariff-plan-actual.resolver";
import {
	tariffPlanHistoryItemsResolver
} from "@tenant/tariff-plan-history/presentation/resolver/tariff-plan-history-items.resolver";
import {tariffPlanItemsResolver} from "@tenant/tariff-plan/presentation/resolver/tariff-plan-items.resolver";
import {countryResolver} from "@tenant/business-profile/presentation/resolver/country.resolver";
import {baseLanguageResolver} from "@tenant/business-profile/presentation/resolver/base-language.resolver";
import {businessProfileResolver} from "@tenant/business-profile/presentation/resolver/business-profile.resolver";
import {tenantSecondRouters} from "@tenant/tenant.second.routers";

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
            ...tenantSecondRouters,
            {
                path: ':tenantId',
                canMatch: [canMatchBecauseTenantId],
                resolve: {
                    businessProfile: businessProfileResolver,
                },
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
                                            tariffPlanHistoryItems: tariffPlanHistoryItemsResolver,
                                            tariffPlanActual: tariffPlanActualResolver,
                                            country: countryResolver,
                                            baseLanguage: baseLanguageResolver,
                                        },
                                        loadComponent: () => import('@tenant/tariff-plan/presentation/ui/page/tariff-plan.page')
                                    }
                                ]
                            },
                            {
                                path: 'member',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/member/presentation/ui/page/list/list.member.page')
                                    }
                                ]
                            },
                            {
                                path: 'absence',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/absence/presentation/ui/page/grid.absence.page')
                                    }
                                ]
                            },
                            {
                                path: 'analytic',
                                children: [
                                    {
                                        path: 'sms-used',
                                        loadComponent: () => import('@tenant/analytic/presentation/ui/page/sms-used/sms-used.analytic.page')
                                    },
                                    {
                                        path: 'date-range-report',
                                        loadComponent: () => import('@tenant/analytic/presentation/ui/page/date-range-report/date-range-report.analytic.page')
                                    },
                                ]
                            },
                            {
                                path: 'order',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/order/presentation/ui/page/list/list.order.page')
                                    }
                                ]
                            },
                            {
                                path: 'payment',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/payment/presentation/ui/page/list/list.payment.page')
                                    }
                                ]
                            },
                            {
                                path: 'event',
                                children: [
                                    {
                                        path: 'requested',
                                        loadComponent: () => import('@tenant/event/presentation/ui/page/requested/requested.event.page')
                                    },
                                    {
                                        path: 'calendar',
                                        loadComponent: () => import('@tenant/event/presentation/ui/page/calendar/calendar.event.page')
                                    },
                                    {
                                        path: 'statistic',
                                        loadComponent: () => import('@tenant/event/presentation/ui/page/statistic/statistic.event.page')
                                    },
                                    {
                                        path: 'calendar-with-specialists',
                                        loadComponent: () => import('@tenant/event/presentation/ui/page/calendar-with-specialists/calendar-with-specialists.event.page')
                                    },
                                ]
                            },
                            {
                                path: 'client',
                                children: [
                                    {
                                        path: 'business-profile',
                                        loadComponent: () => import('@tenant/client/presentation/ui/page/business-profile/business-profile.page')
                                    },
                                    {
                                        path: 'business-settings',
                                        loadComponent: () => import('@tenant/client/presentation/ui/page/business-settings/business-settings.page')
                                    },
                                    {
                                        path: 'settings',
                                        loadComponent: () => import('@tenant/client/presentation/ui/page/settings/settings.page')
                                    },
                                    {
                                        path: 'notification',
                                        children: [
                                            {
                                                path: '',
                                                loadComponent: () => import('@tenant/client/presentation/ui/page/notification/notification.page')
                                            },
                                            {
                                                path: ':id',
                                                loadComponent: () => import('@tenant/client/presentation/ui/page/notification/notification.page')
                                            }
                                        ]
                                    }
                                ]
                            },
							{
								path: 'product',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@tenant/product/presentation/ui/page/list/list.product.page')
									}
								]
							},
							{
								path: 'product-tag',
								children: [
									{
										path: 'list',
										loadComponent: () => import('@tenant/product-tag/presentation/ui/page/list/list.product-tag.page')
									}
								]
							},
                            {
                                path: 'customer',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/customer/presentation/ui/page/list/list.customer.page')
                                    }
                                ]
                            },
                            {
                                path: 'service',
                                children: [
                                    {
                                        path: 'list',
                                        loadComponent: () => import('@tenant/service/presentation/ui/page/list/list.service.page')
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
