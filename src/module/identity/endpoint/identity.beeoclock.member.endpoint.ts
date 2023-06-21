import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum IdentityBeeoclockMemberEndpointEnum {
  getMembers = '/api/v1/member',
}

export const identityBeeoclockMemberEndpoint: EndpointCollectionType = {
  GET: {
    [IdentityBeeoclockMemberEndpointEnum.getMembers]: {
      path: IdentityBeeoclockMemberEndpointEnum.getMembers,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel
    }
  }
}


Endpoint.registerEndpointCollection(identityBeeoclockMemberEndpoint);
