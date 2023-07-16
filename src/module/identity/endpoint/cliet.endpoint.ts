import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum clientEndpointEnum {
  postRelated = '/api/v1/client/related',
  postPaged = '/api/v1/client/paged',
}

export const identityEndpoint: EndpointCollectionType = {
  POST: {
    [clientEndpointEnum.postPaged]: {
      path: clientEndpointEnum.postPaged,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [clientEndpointEnum.postRelated]: {
      path: clientEndpointEnum.postRelated,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },

  }
}


Endpoint.registerEndpointCollection(identityEndpoint);
