import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {TariffPlanHistoryEndpointEnum} from "@tariffPlanHistory/infrastructure/endpoint/tariff-plan-history.endpoint";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {Types} from "@core/shared/types";


@Injectable()
export class GetTenantTariffPlanPagedApi extends BaseApiAdapter<ResponseListType<ITariffPlan.DTO>, [Types.QueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.QueryParams) {
		return this.httpClient.get<ResponseListType<ITariffPlan.DTO>>(TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__PAGED, {
			params,
		});
	}

}
