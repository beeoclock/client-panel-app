import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {IBalance} from "@tenant/balance/domain";
import {balanceEndpointEnum} from "@tenant/balance/infrastructure/endpoint/balance.endpoint";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IBalance.EntityRaw>, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IBalance.EntityRaw>>(balanceEndpointEnum.paged, {
			params,
		});
	}

}
