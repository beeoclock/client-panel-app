import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum absenceEndpointEnum {
	POST = '/api/v1/absence',
	PUT = '/api/v1/absence/{id}',
	GET = '/api/v1/absence/paged',
}

export const absenceEndpoint: EndpointCollectionType = {
	POST: {
		[absenceEndpointEnum.POST]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PUT: {
		[absenceEndpointEnum.PUT]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	GET: {
		[absenceEndpointEnum.GET]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(absenceEndpoint);
