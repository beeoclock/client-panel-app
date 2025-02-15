import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";

@Injectable({
	providedIn: 'root'
})
export class ListServiceApiAdapter extends BaseApiAdapter<ResponseListType<IServiceDto>, [TableState_BackendFormat]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<IServiceDto>>(serviceEndpointEnum.paged, {
			params: params as never,
		});
	}

}
