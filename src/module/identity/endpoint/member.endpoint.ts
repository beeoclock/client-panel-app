import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberEndpointEnum {
  getMembers = '/api/v1/member',
}

export const memberEndpoint: EndpointCollectionType = {
  GET: {
    [memberEndpointEnum.getMembers]: {
      source: SourceNetworkEnum.panel
    }
  }
}


Endpoint.registerEndpointCollection(memberEndpoint);
