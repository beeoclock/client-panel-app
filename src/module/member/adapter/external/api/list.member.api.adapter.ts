import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

type ResponseType = {
	items: Member.RIMember[];
	totalSize: number;
};

@Injectable({
	providedIn: 'root'
})
export class ListMemberApiAdapter extends BaseApiAdapter<ResponseType> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseType>(memberEndpointEnum.paged, {
			params: params as never,
		});
	}

}
