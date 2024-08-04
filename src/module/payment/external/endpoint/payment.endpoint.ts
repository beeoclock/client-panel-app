import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export const PaymentEndpoint = {
	CREATE: '/api/v1/payment',
	UPDATE: '/api/v1/payment/{id}',
	DELETE: '/api/v1/payment/{id}',
	DETAILS: '/api/v1/payment/{id}',
	PAGED: '/api/v1/payment/paged',
}

export const paymentEndpoint: EndpointCollectionType = {
	POST: {
		[PaymentEndpoint.CREATE]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PUT: {
		[PaymentEndpoint.UPDATE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	DELETE: {
		[PaymentEndpoint.DELETE]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	GET: {
		[PaymentEndpoint.PAGED]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[PaymentEndpoint.DETAILS]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
}


Endpoint.registerEndpointCollection(paymentEndpoint);
