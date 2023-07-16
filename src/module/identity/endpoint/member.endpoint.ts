import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberEndpointEnum {
  getMembers = '/api/v1/member',
  postRelated = '/api/v1/member/related',
}

export const memberEndpoint: EndpointCollectionType = {
  GET: {
    [memberEndpointEnum.getMembers]: {
      path: memberEndpointEnum.getMembers,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel
    }
  },
  POST: {
    [memberEndpointEnum.postRelated]: {
      path: memberEndpointEnum.postRelated,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    }
  }
}


Endpoint.registerEndpointCollection(memberEndpoint);
