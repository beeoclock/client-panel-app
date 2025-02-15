import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";

@Injectable({
	providedIn: 'root'
})
export class PagedAbsenceApiAdapter extends BaseApiAdapter<ResponseListType<IAbsence.DTO>, [TableState_BackendFormat]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: TableState_BackendFormat) {
		return this.httpClient.get<ResponseListType<IAbsence.DTO>>(absenceEndpointEnum.PAGED, {
			params: params as never,
		});
	}

}
