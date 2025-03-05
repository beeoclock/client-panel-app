import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TariffPlanEndpointEnum} from "@tariffPlan/infrastructure/endpoint/tariff-plan.endpoint";

type Response = {url: string;};

@Injectable()
export class GetBillingPortalApi extends BaseApiAdapter<Response, [void]> {

	public override execute$() {
		return this.httpClient.get<Response>(TariffPlanEndpointEnum.GET_BILLING_PORTAL);
	}

}
