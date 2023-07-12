import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {EndpointInterface} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";

export type EndpointCollectionType = { [key in keyof typeof RequestMethodEnum]?: Record<string, EndpointInterface> };

export class Endpoint {

  public static endpointMap: {
    [key in keyof typeof RequestMethodEnum]: Map<string, EndpointInterface>
  } = {
    POST: new Map,
    PUT: new Map,
    GET: new Map,
    DELETE: new Map,
    PATCH: new Map,
    OPTIONS: new Map,
    ANY: new Map,
    WS: new Map
  };

  @TypeGuard([is.not.empty])
  public static registerEndpointPackage(endpointPackage: Record<string, EndpointInterface>): void {
    Object.values(endpointPackage).forEach((endpoint: EndpointInterface) => {
      this.registerEndpoint(endpoint);
    });
  }

  @TypeGuard([is.not.empty])
  public static registerEndpointCollection(endpointCollection: EndpointCollectionType): void {
    Object.values(endpointCollection).forEach((pack) => {
      this.registerEndpointPackage(pack);
    });
  }

  @TypeGuard([is.not.empty])
  public static registerEndpoint(endpoint: EndpointInterface): void {
    this.endpointMap[endpoint.method].set(endpoint.path, endpoint);
  }
}
