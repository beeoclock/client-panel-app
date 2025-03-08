import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum TariffPlanEndpointEnum {
	POST__STRIPE_WEBHOOK = '/api/v1/stripe-webhook',

	POST__TENANT_TARIFF_PLAN__CANCEL = '/api/v1/tenantTariffPlan/cancel',
	POST__TENANT_TARIFF_PLAN__CHANGE_PAYMENT_METHOD_CHECKOUT_SESSION = '/api/v1/tenantTariffPlan/change-payment-method-checkout-session',

	PATCH__TENANT_TARIFF_PLAN__CHANGE = '/api/v1/tenantTariffPlan/change',

	GET_BILLING_PORTAL = '/api/v1/tenantTariffPlan/billing-portal',
	GET = '/api/v1/paged',
	GET_ITEM = '/api/v1/{id}',
}

export const tariffPlanEndpoint: EndpointCollectionType = {
	POST: {
		[TariffPlanEndpointEnum.POST__STRIPE_WEBHOOK]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[TariffPlanEndpointEnum.POST__TENANT_TARIFF_PLAN__CANCEL]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[TariffPlanEndpointEnum.POST__TENANT_TARIFF_PLAN__CHANGE_PAYMENT_METHOD_CHECKOUT_SESSION]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	PATCH: {
		[TariffPlanEndpointEnum.PATCH__TENANT_TARIFF_PLAN__CHANGE]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	GET: {
		[TariffPlanEndpointEnum.GET_BILLING_PORTAL]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[TariffPlanEndpointEnum.GET]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[TariffPlanEndpointEnum.GET_ITEM]: {
			source: SourceNetworkEnum.tariffPlan,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(tariffPlanEndpoint);
