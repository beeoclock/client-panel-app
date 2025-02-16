import {Injectable} from '@angular/core';
import * as Member from '@src/core/business-logic/member';
import {memberEndpointEnum} from "@member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {Types} from '@core/shared/types';

type ResponseType = {
	items: Member.RIMember[];
	totalSize: number;
};

@Injectable({
	providedIn: 'root'
})
export class GetApi extends BaseApiAdapter<ResponseType, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseType>(memberEndpointEnum.paged, {
			params: params as never,
		});
	}

}
