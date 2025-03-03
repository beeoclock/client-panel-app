import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {TariffPlanEndpointEnum} from "@tariffPlan/infrastructure/endpoint/tariff-plan.endpoint";

@Injectable()
export class PatchTenantTariffPlanChangeApi extends BaseApiAdapter<string, [ITariffPlan.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: ITariffPlan.DTO) {

		return this.httpClient.patch<string>(TariffPlanEndpointEnum.PATCH__TENANT_TARIFF_PLAN__CHANGE, body);
	}

}
