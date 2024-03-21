import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {EndpointInterface} from "@utility/domain/interface/i.endpoint/i.endpoint-replace";

export type EndpointCollectionType = {
	[key in keyof typeof RequestMethodEnum]?: Record<string, EndpointInterface>
};

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

	@TypeGuard([is.not_empty])
	public static registerEndpointPackage(method: RequestMethodEnum, endpointPackage: Record<string, EndpointInterface>): void {
		Object.keys(endpointPackage).forEach((path: string) => {
			this.registerEndpoint(method, path, endpointPackage[path]);
		});
	}

	@TypeGuard([is.not_empty])
	public static registerEndpointCollection(endpointCollection: EndpointCollectionType): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		Object.keys(endpointCollection).forEach((method: RequestMethodEnum) => {
			this.registerEndpointPackage(method, endpointCollection[method]!);
		});
	}

	@TypeGuard([is.not_empty])
	public static registerEndpoint(method: RequestMethodEnum, path: string, endpoint: EndpointInterface): void {
		this.endpointMap[method].set(path, endpoint);
	}
}
