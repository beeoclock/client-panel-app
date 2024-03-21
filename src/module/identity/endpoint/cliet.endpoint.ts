import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum clientEndpointEnum {
  postRelated = '/api/v1/client/related',
  postPaged = '/api/v1/client/paged',
}

export const identityEndpoint: EndpointCollectionType = {
  POST: {
    [clientEndpointEnum.postPaged]: {
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [clientEndpointEnum.postRelated]: {
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },

  }
}


Endpoint.registerEndpointCollection(identityEndpoint);
