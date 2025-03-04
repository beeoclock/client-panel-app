import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {Types} from "@core/shared/types";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IOrder.DTO>, [Types.FindQueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IOrder.DTO>>(OrderEndpoint.PAGED, {
			params: params as never,
		});
	}

}
