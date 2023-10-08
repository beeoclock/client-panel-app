import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum businessProfileEndpointEnum {
	item = '/api/v1/business-profile',
	update = '/api/v1/business-profile',
}

export const businessProfileEndpoint: EndpointCollectionType = {
	GET: {
		[businessProfileEndpointEnum.item]: {
			path: businessProfileEndpointEnum.item,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			replace: true,
			header: {
				authorization: true,
			}
		}
	},
	PUT: {
		[businessProfileEndpointEnum.update]: {
			path: businessProfileEndpointEnum.update,
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
							const key = `http.PUT.${businessProfileEndpointEnum.update}.after.success`;
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
}


Endpoint.registerEndpointCollection(businessProfileEndpoint);
