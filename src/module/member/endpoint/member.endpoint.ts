import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum memberEndpointEnum {
  paged = '/api/v1/member/paged',
  item = '/api/v1/member/{id}',
  update = '/api/v1/member/{id}',
  delete = '/api/v1/member/{id}',
  archive = '/api/v1/member/{id}/archive',
  create = '/api/v1/member',
}

export const memberEndpoint: EndpointCollectionType = {
  POST: {
    [memberEndpointEnum.paged]: {
      path: memberEndpointEnum.paged,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    },
    [memberEndpointEnum.item]: {
      path: memberEndpointEnum.item,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
    [memberEndpointEnum.create]: {
      path: memberEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [memberEndpointEnum.update]: {
      path: memberEndpointEnum.update,
      method: RequestMethodEnum.PUT,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  PATCH: {
    [memberEndpointEnum.archive]: {
      path: memberEndpointEnum.archive,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  DELETE: {
    [memberEndpointEnum.delete]: {
      path: memberEndpointEnum.delete,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
}


Endpoint.registerEndpointCollection(memberEndpoint);
