import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {
	TariffPlanHistoryEndpointEnum
} from "@tenant/tariff-plan-history/infrastructure/endpoint/tariff-plan-history.endpoint";
import {ITariffPlanHistory} from "@tenant/tariff-plan-history/domain/interface/i.tariff-plan-history";


@Injectable()
export class GetTenantTariffPlanActualApi extends BaseApiAdapter<ITariffPlanHistory.DTO> {

	@TypeGuard([is.string])
	public override execute$() {
		return this.httpClient.get<ITariffPlanHistory.DTO>(TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__ACTUAL);
	}

}
