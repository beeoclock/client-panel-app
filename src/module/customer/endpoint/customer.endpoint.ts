import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum customerEndpointEnum {
	paged = '/api/v1/customer/paged',
	item = '/api/v1/customer/{id}',
	update = '/api/v1/customer/{id}',
	delete = '/api/v1/customer/{id}',
	archive = '/api/v1/customer/{id}/archive',
	create = '/api/v1/customer',
}

export const customerEndpoint: EndpointCollectionType = {
	GET: {
		[customerEndpointEnum.item]: {
			path: customerEndpointEnum.item,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
		[customerEndpointEnum.paged]: {
			path: customerEndpointEnum.paged,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
	},
	POST: {
		[customerEndpointEnum.create]: {
			path: customerEndpointEnum.create,
			method: RequestMethodEnum.POST,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${customerEndpointEnum.create}.after.success`;
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
		[customerEndpointEnum.update]: {
			path: customerEndpointEnum.update,
			method: RequestMethodEnum.PUT,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.PUT.${customerEndpointEnum.update}.after.success`;
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
	PATCH: {
		[customerEndpointEnum.archive]: {
			path: customerEndpointEnum.archive,
			method: RequestMethodEnum.PATCH,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		},
	},
	DELETE: {
		[customerEndpointEnum.delete]: {
			path: customerEndpointEnum.delete,
			method: RequestMethodEnum.DELETE,
			source: SourceNetworkEnum.panel,
			replace: true,
			before: {
				accept: true,
			},
			header: {
				authorization: true,
			}
		},
	},
}


Endpoint.registerEndpointCollection(customerEndpoint);
