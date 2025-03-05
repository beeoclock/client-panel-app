import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TariffPlanEndpointEnum} from "@tariffPlan/infrastructure/endpoint/tariff-plan.endpoint";


@Injectable()
export class GetBillingPortalApi extends BaseApiAdapter<string, [void]> {

	public override execute$() {
		return this.httpClient.get<string>(TariffPlanEndpointEnum.GET_BILLING_PORTAL);
	}

}
