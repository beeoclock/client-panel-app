import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum TariffPlanHistoryEndpointEnum {
	GET__TENANT_TARIFF_PLAN__ACTUAL = '/api/v1/tenantTariffPlan/actual',
	GET__TENANT_TARIFF_PLAN__PAGED = '/api/v1/tenantTariffPlan/paged',
}

export const tariffPlanHistoryEndpoint: EndpointCollectionType = {
	GET: {
		[TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__PAGED]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__ACTUAL]: {
			source: SourceNetworkEnum.tariffPlan,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(tariffPlanHistoryEndpoint);
