import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {TranslateService} from "@ngx-translate/core";

export enum expenseEndpointEnum {
    paged = '/api/v1/expense/paged',
    item = '/api/v1/expense/{id}',
    update = '/api/v1/expense/{id}',
    delete = '/api/v1/expense/{id}',
    create = '/api/v1/expense',
}

export const expenseEndpoint: EndpointCollectionType = {
    GET: {
        [expenseEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [expenseEndpointEnum.paged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [expenseEndpointEnum.create]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            },
            after: {
                success: {
                    notification: {
                        execute: (translateService: TranslateService) => {
                            const key = `http.POST.${expenseEndpointEnum.create}.after.success`;
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
        [expenseEndpointEnum.update]: {
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
                            const key = `http.PUT.${expenseEndpointEnum.update}.after.success`;
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
        [expenseEndpointEnum.delete]: {
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


Endpoint.registerEndpointCollection(expenseEndpoint);
