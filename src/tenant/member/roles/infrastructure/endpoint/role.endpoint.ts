import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum roleEndpointEnum {
    paged = '/api/v1/role/paged',
    item = '/api/v1/role/{id}',
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    update = '/api/v1/role/{id}',
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
    delete = '/api/v1/role/{id}',
    archive = '/api/v1/role/{id}/archive',
    create = '/api/v1/role',
}

export const roleEndpoint: EndpointCollectionType = {
    GET: {
        [roleEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
        [roleEndpointEnum.paged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [roleEndpointEnum.create]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
				tenantId: true,
            }
        }
    },
    PUT: {
        [roleEndpointEnum.update]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
    PATCH: {
        [roleEndpointEnum.archive]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
    DELETE: {
        [roleEndpointEnum.delete]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
				tenantId: true,
            }
        },
    },
}


Endpoint.registerEndpointCollection(roleEndpoint);
