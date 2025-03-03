import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {TariffPlanEndpointEnum} from "@tariffPlan/infrastructure/endpoint/tariff-plan.endpoint";
import {ITariffPlan} from "@core/business-logic/tariif-plan/interface/i.tariff-plan";


@Injectable()
export class GetItemApi extends BaseApiAdapter<ITariffPlan.DTO, [string]> {

	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.get<ITariffPlan.DTO>(TariffPlanEndpointEnum.GET__TENANT_TARIFF_PLAN__ACTUAL, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id,
			}),
		});
	}

}
