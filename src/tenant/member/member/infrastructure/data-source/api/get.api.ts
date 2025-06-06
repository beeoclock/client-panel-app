import {Injectable} from '@angular/core';
import {memberEndpointEnum} from "@tenant/member/member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from '@core/shared/types';
import {IMember} from "@tenant/member/member/domain/interface/i.member";

type ResponseType = ResponseListType<IMember.DTO>;

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseType, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseType>(memberEndpointEnum.paged, {
			params,
		});
	}

}
