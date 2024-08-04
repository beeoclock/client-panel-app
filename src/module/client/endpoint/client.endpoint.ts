import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum clientEndpointEnum {
    item = '/api/v1/client/selected-client',
    update = '/api/v1/client/selected-client',
    delete = '/api/v1/client/selected-client',
    archive = '/api/v1/client/selected-item/archive',
}

export const clientEndpoint: EndpointCollectionType = {
    GET: {
        [clientEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    PUT: {
        [clientEndpointEnum.update]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    PATCH: {
        [clientEndpointEnum.archive]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
    DELETE: {
        [clientEndpointEnum.delete]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
    },
}


Endpoint.registerEndpointCollection(clientEndpoint);
