import {Endpoint, EndpointCollectionType} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";

export enum mediaEndpointEnum {
  item = '/api/v1/media/{id}',
}

export const mediaEndpoint: EndpointCollectionType = {
  GET: {
    [mediaEndpointEnum.item]: {
      source: SourceNetworkEnum.panel,
      replace: true,
      header: {
        authorization: true,
      }
    }
  },
}


Endpoint.registerEndpointCollection(mediaEndpoint);
