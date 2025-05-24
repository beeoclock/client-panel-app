import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum balanceEndpointEnum {
    paged = '/api/v1/balance/paged',
    lastItem = '/api/v1/balance',
    create = '/api/v1/balance/top-up-balance',
}

export const balanceEndpoint: EndpointCollectionType = {
    GET: {
        [balanceEndpointEnum.lastItem]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [balanceEndpointEnum.paged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [balanceEndpointEnum.create]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            },
            after: {
                success: {
                    notification: {
                        execute: (translateService: TranslateService) => {
                            const key = `http.POST.${balanceEndpointEnum.create}.after.success`;
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


Endpoint.registerEndpointCollection(balanceEndpoint);
