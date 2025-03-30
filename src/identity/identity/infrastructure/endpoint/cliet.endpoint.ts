import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum clientEndpointEnum {
    postRelated = '/api/v1/client/related',
    postPaged = '/api/v1/client/paged',
}

export const identityEndpoint: EndpointCollectionType = {
    POST: {
        [clientEndpointEnum.postPaged]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },
        [clientEndpointEnum.postRelated]: {
            source: SourceNetworkEnum.panel,
            header: {
                authorization: true,
                tenantId: true,
            }
        },

    }
}


Endpoint.registerEndpointCollection(identityEndpoint);
