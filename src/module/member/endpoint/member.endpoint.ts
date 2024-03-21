import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
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
  GET: {
    [memberEndpointEnum.item]: {
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
		[memberEndpointEnum.paged]: {
			source: SourceNetworkEnum.panel,
			header: {
				authorization: true
			}
		},
  },
  POST: {
    [memberEndpointEnum.create]: {
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true,
      }
    }
  },
  PUT: {
    [memberEndpointEnum.update]: {
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  PATCH: {
    [memberEndpointEnum.archive]: {
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
  DELETE: {
    [memberEndpointEnum.delete]: {
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    },
  },
}


Endpoint.registerEndpointCollection(memberEndpoint);
