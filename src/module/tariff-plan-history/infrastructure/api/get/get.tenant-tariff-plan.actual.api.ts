import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {TariffPlanHistoryEndpointEnum} from "@tariffPlanHistory/infrastructure/endpoint/tariff-plan-history.endpoint";


@Injectable()
export class GetTenantTariffPlanActualApi extends BaseApiAdapter<ITariffPlan.DTO> {

	@TypeGuard([is.string])
	public override execute$() {
		return this.httpClient.get<ITariffPlan.DTO>(TariffPlanHistoryEndpointEnum.GET__TENANT_TARIFF_PLAN__ACTUAL);
	}

}
