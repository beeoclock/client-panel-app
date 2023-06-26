import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum customerEndpointEnum {
  paged = '/api/v1/customer',
  item = '/api/v1/customer/{id}',
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
    }
  },
}


Endpoint.registerEndpointCollection(customerEndpoint);
