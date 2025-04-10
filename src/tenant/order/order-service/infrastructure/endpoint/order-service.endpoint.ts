import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export const OrderServiceEndpoint = {
	CREATE: '/api/v1/order',
	UPDATE: '/api/v1/order/{id}',
	UPDATE_SERVICE: '/api/v1/order/{id}/service',
	UPDATE_STATUS: '/api/v1/order/{id}/status/{status}',
	UPDATE_SERVICE_STATUS: '/api/v1/order/{id}/service/{serviceId}/status/{status}',
	DELETE: '/api/v1/order/{id}', // TODO: check if backend did changes
	DETAILS: '/api/v1/order/{id}',
	PAGED: '/api/v1/order/paged',
	BUSY_SLOTS: '/api/v1/order/busy-slots',
}

export const orderEndpoint: EndpointCollectionType = {
	POST: {
		[OrderServiceEndpoint.CREATE]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PATCH: {
		[OrderServiceEndpoint.UPDATE_SERVICE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[OrderServiceEndpoint.UPDATE_STATUS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[OrderServiceEndpoint.UPDATE_SERVICE_STATUS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PUT: {
		[OrderServiceEndpoint.UPDATE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	DELETE: {
		[OrderServiceEndpoint.DELETE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	GET: {
		[OrderServiceEndpoint.PAGED]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[OrderServiceEndpoint.BUSY_SLOTS]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[OrderServiceEndpoint.DETAILS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
}


Endpoint.registerEndpointCollection(orderEndpoint);
