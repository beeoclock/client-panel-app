import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum tenantPluginEndpointEnum {
	paged = '/api/v1/plugins/paged',
	attachPlugin = '/api/v1/plugins/attach-plugin',
	detachPlugin = '/api/v1/plugins/detach-plugin/{pluginName}',
	executeFunction = '/api/v1/plugins/{pluginName}/{functionName}',
}

export const tenantPluginEndpoint: EndpointCollectionType = {
	GET: {
		[tenantPluginEndpointEnum.paged]: {
			source: SourceNetworkEnum.plugin,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	PATCH: {
		[tenantPluginEndpointEnum.attachPlugin]: {
			source: SourceNetworkEnum.plugin,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[tenantPluginEndpointEnum.detachPlugin]: {
			source: SourceNetworkEnum.plugin,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	POST: {
		[tenantPluginEndpointEnum.executeFunction]: {
			source: SourceNetworkEnum.plugin,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(tenantPluginEndpoint);
