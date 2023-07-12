import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum customerEndpointEnum {
  paged = '/api/v1/customer/paged',
  item = '/api/v1/customer/{id}',
  update = '/api/v1/customer/{id}',
  delete = '/api/v1/customer/{id}',
  archive = '/api/v1/customer/{id}/archive',
  create = '/api/v1/customer',
}

export const customerEndpoint: EndpointCollectionType = {
  POST: {
    [customerEndpointEnum.paged]: {
      path: customerEndpointEnum.paged,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [customerEndpointEnum.item]: {
      path: customerEndpointEnum.item,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
    [customerEndpointEnum.create]: {
      path: customerEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [customerEndpointEnum.update]: {
      path: customerEndpointEnum.update,
      method: RequestMethodEnum.PUT,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  PATCH: {
    [customerEndpointEnum.archive]: {
      path: customerEndpointEnum.archive,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  DELETE: {
    [customerEndpointEnum.delete]: {
      path: customerEndpointEnum.delete,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
}


Endpoint.registerEndpointCollection(customerEndpoint);
