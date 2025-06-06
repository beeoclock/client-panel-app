import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum businessProfileEndpointEnum {
	item = '/api/v1/business-profile',
	update = '/api/v1/business-profile',
}

export const businessProfileEndpoint: EndpointCollectionType = {
	GET: {
		[businessProfileEndpointEnum.item]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		}
	},
	PUT: {
		[businessProfileEndpointEnum.update]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
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
