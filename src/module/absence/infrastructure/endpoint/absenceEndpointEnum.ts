import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export const absenceEndpointEnum = {
    CREATE: '/api/v1/absence',
    UPDATE: '/api/v1/absence/{id}',
    DELETE: '/api/v1/absence/{id}',
    DETAILS: '/api/v1/absence/{id}',
    PAGED: '/api/v1/absence/paged',
    ARCHIVE: '/api/v1/absence/{id}/archive',
    UNARCHIVE: '/api/v1/absence/{id}/unarchive',
}

export const absenceEndpoint: EndpointCollectionType = {
    PATCH: {
        [absenceEndpointEnum.ARCHIVE]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [absenceEndpointEnum.UNARCHIVE]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    POST: {
        [absenceEndpointEnum.CREATE]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    PUT: {
        [absenceEndpointEnum.UPDATE]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    DELETE: {
        [absenceEndpointEnum.DELETE]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    GET: {
        [absenceEndpointEnum.PAGED]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [absenceEndpointEnum.DETAILS]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
}


Endpoint.registerEndpointCollection(absenceEndpoint);
