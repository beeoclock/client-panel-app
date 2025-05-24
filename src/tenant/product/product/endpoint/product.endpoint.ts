import {TranslateService} from '@ngx-translate/core';
import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum productEndpointEnum {
	postCreateProduct = '/api/v1/product',
	putUpdateProduct = '/api/v1/product/{id}',
	deleteProduct = '/api/v1/product/{id}',
	getPagedProducts = '/api/v1/product/paged',
	getProduct = '/api/v1/product/{id}',
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
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${productEndpointEnum.postCreateProduct}.after.success`;
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
		[productEndpointEnum.putUpdateProduct]: {
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
							const key = `http.PUT.${productEndpointEnum.putUpdateProduct}.after.success`;
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
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.DELETE.${productEndpointEnum.deleteProduct}.after.success`;
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

Endpoint.registerEndpointCollection(productEndpoint);
