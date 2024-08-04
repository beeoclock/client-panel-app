import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {IServiceDto} from "@order/external/interface/i.service.dto";

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
