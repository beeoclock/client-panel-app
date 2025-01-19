import { Endpoint, EndpointCollectionType } from '@utility/domain/endpoint';
import { SourceNetworkEnum } from '@utility/domain/enum/source.network.enum';

export enum productEndpointEnum {
	postCreateProduct = '/api/v1/product',
    putUpdateProduct = '/api/v1/product/{id}',
    deleteProduct = '/api/v1/product/{id}',
    getPagedProducts = '/api/v1/product/paged',
    getProduct = '/api/v1/product/{id}'
}

export const productEndpoint: EndpointCollectionType = {
    GET: {
        [productEndpointEnum.getProduct]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [productEndpointEnum.getPagedProducts]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
	POST: {
		[productEndpointEnum.postCreateProduct]: {
			source: SourceNetworkEnum.panel,
            header: {
			    authorization: true,
				tenantId: true,
			}
		}
	},
	PUT: {
		[productEndpointEnum.putUpdateProduct]: {
			source: SourceNetworkEnum.panel,
            replace: true,
			header: {
				authorization: true,
				tenantId: true,
			},
		},
	},
    DELETE: {
		[productEndpointEnum.deleteProduct]: {
			source: SourceNetworkEnum.panel,
            replace: true,
			before: {
				accept: true,
			},
			header: {
				authorization: true,
				tenantId: true,
			},
		},
	}
};

Endpoint.registerEndpointCollection(productEndpoint);
