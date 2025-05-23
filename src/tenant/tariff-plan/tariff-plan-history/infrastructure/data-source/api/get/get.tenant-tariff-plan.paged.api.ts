import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {
	TariffPlanHistoryEndpointEnum
} from "@tenant/tariff-plan/tariff-plan-history/infrastructure/endpoint/tariff-plan-history.endpoint";
import {Types} from "@core/shared/types";
import {ITariffPlanHistory} from "@tenant/tariff-plan/tariff-plan-history/domain/interface/i.tariff-plan-history";


@Injectable()
export class GetTenantTariffPlanPagedApi extends BaseApiAdapter<ResponseListType<ITariffPlanHistory.DTO>, [Types.QueryParams]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.QueryParams) {
		return this.httpClient.get<ResponseListType<ITariffPlanHistory.DTO>>(TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__PAGED, {
			params,
		});
	}

}
