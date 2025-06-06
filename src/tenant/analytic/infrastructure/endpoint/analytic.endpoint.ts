import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum AnalyticEndpointEnum {
	smsUsed = '/api/v1/report/sms-used',
	dailyReport = '/api/v1/report/daily-report',
	dateRangeReport = '/api/v1/report/date-range-report',
}

export const analyticEndpoint: EndpointCollectionType = {
	GET: {
		[AnalyticEndpointEnum.smsUsed]: {
			source: SourceNetworkEnum.analytic,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[AnalyticEndpointEnum.dailyReport]: {
			source: SourceNetworkEnum.analytic,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[AnalyticEndpointEnum.dateRangeReport]: {
			source: SourceNetworkEnum.analytic,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(analyticEndpoint);
