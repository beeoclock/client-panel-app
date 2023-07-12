import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberEndpointEnum {
  getMembers = '/api/v1/member',
}

export const memberEndpoint: EndpointCollectionType = {
  GET: {
    [memberEndpointEnum.getMembers]: {
      path: memberEndpointEnum.getMembers,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel
    }
  }
}


Endpoint.registerEndpointCollection(memberEndpoint);
