import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum customerEndpointEnum {
  getCustomer = '/api/v1/customer',
}

export const customerEndpoint: EndpointCollectionType = {
  GET: {
    [customerEndpointEnum.getCustomer]: {
      path: customerEndpointEnum.getCustomer,
      method: RequestMethodEnum.GET,
      source: SourceNetworkEnum.panel,
      header: {
        authorization: true
      }
    }
  }
}


Endpoint.registerEndpointCollection(customerEndpoint);
