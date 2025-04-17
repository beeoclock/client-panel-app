import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
import {TariffPlanEndpointEnum} from "@tenant/tariff-plan/tariff-plan/infrastructure/endpoint/tariff-plan.endpoint";
import {CurrencyCodeEnum} from "@core/shared/enum";

export namespace PostTenantTariffPlanChangeAmountApi {

	export type RESPONSE = {
		object: "TariffPlanChangeAmountDto";
		differenceToPayInCent: number;
		currency: CurrencyCodeEnum;
		leftoverCreditInCent: number;
		daysUsed: number;
		daysRemaining: number;
	};

	@Injectable()
	export class Request extends BaseApiAdapter<RESPONSE, [ITariffPlan.DTO]> {

		/**
		 * @param body
		 */
		public override execute$(body: ITariffPlan.DTO) {

			return this.httpClient.post<RESPONSE>(TariffPlanEndpointEnum.POST__TENANT_TARIFF_PLAN__CHANGE_AMOUNT, body);

		}

	}


}
