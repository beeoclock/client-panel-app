import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum identityEndpointEnum {
  postCreateUser = '/api/v1/provider/create-user',
  postCreateUserAndBusinessClient = '/api/v1/provider/create-user-and-business-client',
  postCreateBusinessClient = '/api/v1/provider/create-business-client',
  patchSwitchBusinessClient = '/api/v1/provider/switch-business-client',
}

export const identityEndpoint: EndpointCollectionType = {
  POST: {
    [identityEndpointEnum.postCreateUser]: {
      path: identityEndpointEnum.postCreateUser,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.identity
    },
    [identityEndpointEnum.postCreateUserAndBusinessClient]: {
      path: identityEndpointEnum.postCreateUserAndBusinessClient,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.identity
    },
    [identityEndpointEnum.postCreateBusinessClient]: {
      path: identityEndpointEnum.postCreateBusinessClient,
      method: RequestMethodEnum.POST,
      source: SourceNetworkEnum.identity,
      header: {
        authorization: true
      }
    }
  },
  PATCH: {
    [identityEndpointEnum.patchSwitchBusinessClient]: {
      path: identityEndpointEnum.patchSwitchBusinessClient,
      method: RequestMethodEnum.PATCH,
      source: SourceNetworkEnum.identity,
      header: {
        authorization: true
      }
    }
  }
}


Endpoint.registerEndpointCollection(identityEndpoint);
