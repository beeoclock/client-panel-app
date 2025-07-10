import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum tenantPluginEndpointEnum {
	paged = '/api/v1/plugins/paged',
	attachPlugin = '/api/v1/plugins/attach-plugin',
	detachPlugin = '/api/v1/plugins/detach-plugin/{pluginName}',
	executeFunction = '/api/v1/plugins/{pluginName}/{functionName}',
	getFunctions = '/api/v1/store/{pluginName}/functions',
	getPaymentStripeDashboardUrl = '/api/v1/plugins/paymentStripe/getDashboardUrl',
}

export const tenantPluginEndpoint: EndpointCollectionType = {
	GET: {
		[tenantPluginEndpointEnum.getPaymentStripeDashboardUrl]: {
			source: SourceNetworkEnum.plugin,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[tenantPluginEndpointEnum.paged]: {
			source: SourceNetworkEnum.plugin,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[tenantPluginEndpointEnum.getFunctions]: {
			source: SourceNetworkEnum.plugin,
			replace: true,
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
