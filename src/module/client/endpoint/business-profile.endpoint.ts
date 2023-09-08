import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum businessProfileEndpointEnum {
	item = '/api/v1/business-profile',
	update = '/api/v1/business-profile',
}

export const businessProfileEndpoint: EndpointCollectionType = {
	GET: {
		[businessProfileEndpointEnum.item]: {
			path: businessProfileEndpointEnum.item,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	PUT: {
		[businessProfileEndpointEnum.update]: {
			path: businessProfileEndpointEnum.update,
			method: RequestMethodEnum.PUT,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(businessProfileEndpoint);
