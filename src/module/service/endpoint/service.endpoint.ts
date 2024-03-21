import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum serviceEndpointEnum {
	paged = '/api/v1/service/paged',
	item = '/api/v1/service/{id}',
	update = '/api/v1/service/{id}',
	create = '/api/v1/service',
	archive = '/api/v1/service/{id}/archive',
	delete = '/api/v1/service/{id}',

	getBanners = '/api/v1/service-media/{id}/banners',
	patchBanners = '/api/v1/service-media/{id}/banners',
	deleteBanners = '/api/v1/service-media/{serviceId}/{id}',
}

export const serviceEndpoint: EndpointCollectionType = {
	GET: {
		[serviceEndpointEnum.getBanners]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[serviceEndpointEnum.item]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[serviceEndpointEnum.paged]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
	},
	DELETE: {
		[serviceEndpointEnum.delete]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			before: {
				accept: true,
			},
			header: {
				authorization: true,
			}
		},
		[serviceEndpointEnum.deleteBanners]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
	POST: {
		[serviceEndpointEnum.create]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${serviceEndpointEnum.create}.after.success`;
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
	PATCH: {
		[serviceEndpointEnum.archive]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[serviceEndpointEnum.patchBanners]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
	PUT: {
		[serviceEndpointEnum.update]: {
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${serviceEndpointEnum.update}.after.success`;
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
}


Endpoint.registerEndpointCollection(serviceEndpoint);
