import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum pluginEndpointEnum {
	paged = '/api/v1/store/paged',
	pluginFunction = '/api/v1/store/{pluginName}/functions',
}

export const pluginEndpoint: EndpointCollectionType = {
	GET: {
		[pluginEndpointEnum.pluginFunction]: {
			source: SourceNetworkEnum.plugin,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[pluginEndpointEnum.paged]: {
			source: SourceNetworkEnum.plugin,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(pluginEndpoint);
