import {Injectable} from '@angular/core';
import {ICustomer} from '@customer/domain';
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {customerEndpointEnum} from "@customer/index";

@Injectable()
export class ListCustomerApi extends BaseApiAdapter<ResponseListType<ICustomer.DTO>, [TableState_BackendFormat]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<ICustomer.DTO>>(customerEndpointEnum.paged, {
			params: params as never,
		});
	}

}
