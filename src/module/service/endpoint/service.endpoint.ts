import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum serviceEndpointEnum {
  paged = '/api/v1/service/paged',
  item = '/api/v1/service/{id}',
  update = '/api/v1/service/{id}',
  create = '/api/v1/service',
}

export const serviceEndpoint: EndpointCollectionType = {
  POST: {
    [serviceEndpointEnum.paged]: {
      path: serviceEndpointEnum.paged,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [serviceEndpointEnum.create]: {
      path: serviceEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [serviceEndpointEnum.item]: {
      path: serviceEndpointEnum.item,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [serviceEndpointEnum.update]: {
      path: serviceEndpointEnum.update,
      method: RequestMethodEnum.PUT,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    }
  }
}


Endpoint.registerEndpointCollection(serviceEndpoint);
