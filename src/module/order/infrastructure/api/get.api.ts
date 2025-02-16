import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {Types} from "@core/shared/types";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IOrderDto>, [Types.FindQueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IOrderDto>>(OrderEndpoint.PAGED, {
			params: params as never,
		});
	}

}
