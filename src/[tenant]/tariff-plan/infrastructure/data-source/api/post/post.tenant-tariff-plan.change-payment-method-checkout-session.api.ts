import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";
import {TariffPlanEndpointEnum} from "@[tenant]/tariff-plan/infrastructure/endpoint/tariff-plan.endpoint";

@Injectable()
export class PostTenantTariffPlanChangePaymentMethodCheckoutSessionApi extends BaseApiAdapter<ITariffPlan.DTO, [ITariffPlan.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: ITariffPlan.DTO) {

		return this.httpClient.post<ITariffPlan.DTO>(TariffPlanEndpointEnum.POST__TENANT_TARIFF_PLAN__CHANGE_PAYMENT_METHOD_CHECKOUT_SESSION, body);
	}

}
