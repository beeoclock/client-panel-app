import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {TariffPlanEndpointEnum} from "@tenant/tariff-plan/tariff-plan/infrastructure/endpoint/tariff-plan.endpoint";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";


@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<ITariffPlan.DTO>, [Types.QueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.QueryParams) {
		return this.httpClient.get<ResponseListType<ITariffPlan.DTO>>(TariffPlanEndpointEnum.GET, {
			params,
		});
	}

}
