import {Endpoint} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@core/shared/enum/source.network.enum";
import {RequestMethodEnum} from "@core/shared/enum/request-method.enum";

export enum MemberMediaEndpointEnum {
	PATCH_MEMBER_MEDIA = '/api/v1/member-media/{memberId}/avatar',
	DELETE_MEMBER_MEDIA = '/api/v1/member-media/{memberId}/avatar',
}

Endpoint.registerEndpointPackage(RequestMethodEnum.PATCH, {
	[MemberMediaEndpointEnum.PATCH_MEMBER_MEDIA]: {
		source: SourceNetworkEnum.panel,
		replace: true,
		header: {
			authorization: true,
			tenantId: true,
		}
	},
});

Endpoint.registerEndpointPackage(RequestMethodEnum.DELETE, {
	[MemberMediaEndpointEnum.DELETE_MEMBER_MEDIA]: {
		source: SourceNetworkEnum.panel,
		replace: true,
		header: {
			authorization: true,
			tenantId: true,
		}
	},
});
