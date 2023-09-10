import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum serviceEndpointEnum {
  paged = '/api/v1/service/paged',
  item = '/api/v1/service/{id}',
  update = '/api/v1/service/{id}',
  create = '/api/v1/service',
  archive = '/api/v1/service/{id}/archive',
  delete = '/api/v1/service/{id}',

  getBanners = '/api/v1/service-media/{id}/banners',
  patchBanners = '/api/v1/service-media/{id}/banners',
  deleteBanners = '/api/v1/service-media/{serviceId}/{id}',
}

export const serviceEndpoint: EndpointCollectionType = {
  GET: {
    [serviceEndpointEnum.getBanners]: {
      path: serviceEndpointEnum.getBanners,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
    [serviceEndpointEnum.item]: {
      path: serviceEndpointEnum.item,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
		[serviceEndpointEnum.paged]: {
			path: serviceEndpointEnum.paged,
			method: RequestMethodEnum.GET,
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
  },
  DELETE: {
    [serviceEndpointEnum.delete]: {
      path: serviceEndpointEnum.delete,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      before: {
        accept: true,
      },
      header: {
        authorization: true,
      }
    },
    [serviceEndpointEnum.deleteBanners]: {
      path: serviceEndpointEnum.deleteBanners,
      method: RequestMethodEnum.DELETE,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  POST: {
    [serviceEndpointEnum.create]: {
      path: serviceEndpointEnum.create,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    }
  },
  PATCH: {
    [serviceEndpointEnum.archive]: {
      path: serviceEndpointEnum.archive,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
    [serviceEndpointEnum.patchBanners]: {
      path: serviceEndpointEnum.patchBanners,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
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
  },
}


Endpoint.registerEndpointCollection(serviceEndpoint);
