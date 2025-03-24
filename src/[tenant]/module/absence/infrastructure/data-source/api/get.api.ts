import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absence.endpoint";
import {Types} from "@core/shared/types";


@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IAbsence.DTO>, [Types.QueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.QueryParams) {
		return this.httpClient.get<ResponseListType<IAbsence.DTO>>(absenceEndpointEnum.GET, {
			params,
		});
	}

}
