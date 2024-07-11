import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberContextEndpointEnum {
    related = '/api/v1/member-context/related',
    deleteBusinessClientById = '/api/v1/member-context/business-client/{id}',
}

export const memberContextEndpoint: EndpointCollectionType = {
    GET: {
        [memberContextEndpointEnum.related]: {
            source: SourceNetworkEnum.identity,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
    DELETE: {
        [memberContextEndpointEnum.deleteBusinessClientById]: {
            source: SourceNetworkEnum.identity,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    }
}


Endpoint.registerEndpointCollection(memberContextEndpoint);
