import {Endpoint} from "@utility/domain/endpoint";
import {SourceNetworkEnum} from "@utility/domain/enum/source.network.enum";
import {RequestMethodEnum} from "@utility/domain/enum/request-method.enum";

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
		}
	},
});

Endpoint.registerEndpointPackage(RequestMethodEnum.DELETE, {
	[MemberMediaEndpointEnum.DELETE_MEMBER_MEDIA]: {
		source: SourceNetworkEnum.panel,
		replace: true,
		header: {
			authorization: true,
		}
	},
});
