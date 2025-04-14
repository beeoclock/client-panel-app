import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum customerEndpointEnum {
    paged = '/api/v1/customer/paged',
    item = '/api/v1/customer/{id}',
    update = '/api/v1/customer/{id}',
    delete = '/api/v1/customer/{id}',
    archive = '/api/v1/customer/{id}/archive',
    unarchive = '/api/v1/customer/{id}/unarchive',
    create = '/api/v1/customer',
}

export const pluginEndpoint: EndpointCollectionType = {
    GET: {
        [customerEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [customerEndpointEnum.paged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [customerEndpointEnum.create]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
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
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [customerEndpointEnum.unarchive]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    DELETE: {
        [customerEndpointEnum.delete]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            before: {
                accept: true,
            },
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
}


Endpoint.registerEndpointCollection(pluginEndpoint);
