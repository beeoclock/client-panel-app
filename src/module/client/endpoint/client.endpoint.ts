import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum clientEndpointEnum {
  item = '/api/v1/client/selected-client',
  update = '/api/v1/client/selected-client',
  delete = '/api/v1/client/selected-client',
  archive = '/api/v1/client/selected-item/archive',
}

export const clientEndpoint: EndpointCollectionType = {
  POST: {
    [clientEndpointEnum.item]: {
      path: clientEndpointEnum.item,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [clientEndpointEnum.update]: {
      path: clientEndpointEnum.update,
      method: RequestMethodEnum.PUT,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  PATCH: {
    [clientEndpointEnum.archive]: {
      path: clientEndpointEnum.archive,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  DELETE: {
    [clientEndpointEnum.delete]: {
      path: clientEndpointEnum.delete,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
}


Endpoint.registerEndpointCollection(clientEndpoint);
