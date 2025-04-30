import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {ITariffPlan} from "@tenant/tariff-plan/tariff-plan/domain/interface/i.tariff-plan";
import {TariffPlanEndpointEnum} from "@tenant/tariff-plan/tariff-plan/infrastructure/endpoint/tariff-plan.endpoint";

export namespace PatchTenantTariffPlanChangeApi {

	export type Response = { url: string; };
	export type Body = {
		redirectUrl: {
			cancelRedirectUrl: string;
			successRedirectUrl: string;
		};
		tariffPlan: ITariffPlan.DTO;
	};

	@Injectable()
	export class Request extends BaseApiAdapter<Response, [Body]> {

		/**
		 * @param body
		 */
		public override execute$(body: Body) {

			return this.httpClient.patch<Response>(TariffPlanEndpointEnum.PATCH__TENANT_TARIFF_PLAN__CHANGE, body);
		}

	}


}
