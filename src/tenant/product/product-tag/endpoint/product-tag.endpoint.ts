import {TranslateService} from '@ngx-translate/core';
import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum ProductTagEndpointEnum {
	postCreateProduct = '/api/v1/product-tag',
	putUpdateProduct = '/api/v1/product-tag/{id}',
	deleteProduct = '/api/v1/product-tag/{id}',
	getPagedProducts = '/api/v1/product-tag/paged',
	getProduct = '/api/v1/product-tag/{id}',
}

export const productTagEndpoint: EndpointCollectionType = {
	GET: {
		[ProductTagEndpointEnum.getProduct]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
		[ProductTagEndpointEnum.getPagedProducts]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	POST: {
		[ProductTagEndpointEnum.postCreateProduct]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${ProductTagEndpointEnum.postCreateProduct}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		}
	},
	PUT: {
		[ProductTagEndpointEnum.putUpdateProduct]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
				tenantId: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${ProductTagEndpointEnum.putUpdateProduct}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
	},
	DELETE: {
		[ProductTagEndpointEnum.deleteProduct]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			before: {
				accept: true,
			},
			header: {
				authorization: true,
				tenantId: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.DELETE.${ProductTagEndpointEnum.deleteProduct}.after.success`;
							const {title, message} = translateService.instant(key);
							return {
								title,
								message
							}
						}
					}
				}
			}
		},
	}
};

Endpoint.registerEndpointCollection(productTagEndpoint);
