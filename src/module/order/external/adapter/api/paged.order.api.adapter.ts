import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {OrderEndpoint} from "@order/external/endpoint/order.endpoint";

@Injectable({
	providedIn: 'root'
})
export class PagedOrderApiAdapter extends BaseApiAdapter<ResponseListType<IOrderDto>, [TableState_BackendFormat]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<IOrderDto>>(OrderEndpoint.PAGED, {
			params: params as never,
		});
	}

}
