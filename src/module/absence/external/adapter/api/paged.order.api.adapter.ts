import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {IAbsenceDto} from "@module/absence/external/interface/i.absence.dto";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";

@Injectable({
	providedIn: 'root'
})
export class PagedAbsenceApiAdapter extends BaseApiAdapter<ResponseListType<IAbsenceDto>, [TableState_BackendFormat]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<IAbsenceDto>>(AbsenceEndpoint.PAGED, {
			params: params as never,
		});
	}

}
