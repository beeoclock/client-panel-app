import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum eventEndpointEnum {
  paged = '/api/v1/event/paged',
  item = '/api/v1/event/{id}',
  update = '/api/v1/event/{id}',
  delete = '/api/v1/event/{id}',
  archive = '/api/v1/event/{id}/archive',
  create = '/api/v1/event',
}

export const eventEndpoint: EndpointCollectionType = {
  POST: {
    [eventEndpointEnum.paged]: {
      path: eventEndpointEnum.paged,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [eventEndpointEnum.item]: {
      path: eventEndpointEnum.item,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
    [eventEndpointEnum.create]: {
      path: eventEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [eventEndpointEnum.update]: {
      path: eventEndpointEnum.update,
      method: RequestMethodEnum.PUT,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  PATCH: {
    [eventEndpointEnum.archive]: {
      path: eventEndpointEnum.archive,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  DELETE: {
    [eventEndpointEnum.delete]: {
      path: eventEndpointEnum.delete,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
}


Endpoint.registerEndpointCollection(eventEndpoint);
