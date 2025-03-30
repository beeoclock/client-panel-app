import {Endpoint, EndpointCollectionType} from "@shared/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum mediaEndpointEnum {
    item = '/api/v1/media/{id}',
}

export const mediaEndpoint: EndpointCollectionType = {
    GET: {
        [mediaEndpointEnum.item]: {
            source: SourceNetworkEnum.panel,
            replace: true,
            header: {
                authorization: true,
                tenantId: true,
            }
        }
    },
}


Endpoint.registerEndpointCollection(mediaEndpoint);
