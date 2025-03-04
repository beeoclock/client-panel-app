import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";

export enum memberEndpointEnum {
    getMembers = '/api/v1/member',
}

export const memberEndpoint: EndpointCollectionType = {
    GET: {
        [memberEndpointEnum.getMembers]: {
            source: SourceNetworkEnum.panel,
            header: {
                tenantId: true,
            }
        }
    }
}


Endpoint.registerEndpointCollection(memberEndpoint);
