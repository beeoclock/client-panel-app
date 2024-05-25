import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export const OrderEndpoint = {
	CREATE: '/api/v1/order',
	UPDATE: '/api/v1/order/{id}',
	UPDATE_STATUS: '/api/v1/order/{id}/status/{status}',
	UPDATE_SERVICE_STATUS: '/api/v1/order/{id}/service/{serviceId}/status/{status}',
	DELETE: '/api/v1/order/{id}', // TODO: check if backend did changes
	DETAILS: '/api/v1/order/{id}',
	PAGED: '/api/v1/order/paged',
	BUSY_SLOTS: '/api/v1/order/busy-slots',
}

export const orderEndpoint: EndpointCollectionType = {
	POST: {
		[OrderEndpoint.CREATE]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		}
	},
	PATCH: {
		[OrderEndpoint.UPDATE_STATUS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[OrderEndpoint.UPDATE_SERVICE_STATUS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	PUT: {
		[OrderEndpoint.UPDATE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	DELETE: {
		[OrderEndpoint.DELETE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	GET: {
		[OrderEndpoint.PAGED]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[OrderEndpoint.BUSY_SLOTS]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			}
		},
		[OrderEndpoint.DETAILS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
}


Endpoint.registerEndpointCollection(orderEndpoint);