import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberContextEndpointEnum {
  postRelated = '/api/v1/member-context/related',
  deleteBusinessClientById = '/api/v1/member-context/business-client/{id}',
}

export const memberContextEndpoint: EndpointCollectionType = {
  POST: {
    [memberContextEndpointEnum.postRelated]: {
      path: memberContextEndpointEnum.postRelated,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.identity,
      header: {
        authorization: true
      }
    }
  },
  DELETE: {
    [memberContextEndpointEnum.deleteBusinessClientById]: {
      path: memberContextEndpointEnum.deleteBusinessClientById,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.identity,
      replace: true,
      header: {
        authorization: true
      }
    }
  }
}


Endpoint.registerEndpointCollection(memberContextEndpoint);
