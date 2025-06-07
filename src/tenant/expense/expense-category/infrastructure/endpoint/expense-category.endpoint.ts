import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum expenseCategoryEndpointEnum {
	paged = '/api/v1/expense/category',
	create = '/api/v1/expense/category',
}

export const expenseCategoryEndpoint: EndpointCollectionType = {
	GET: {
		[expenseCategoryEndpointEnum.paged]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			}
		},
	},
	POST: {
		[expenseCategoryEndpointEnum.create]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true,
				tenantId: true,
			},
			after: {
				success: {
					notification: {
						execute: (translateService: TranslateService) => {
							const key = `http.POST.${expenseCategoryEndpointEnum.create}.after.success`;
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


Endpoint.registerEndpointCollection(expenseCategoryEndpoint);
