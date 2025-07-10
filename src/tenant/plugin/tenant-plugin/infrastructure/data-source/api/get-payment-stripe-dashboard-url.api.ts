import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

@Injectable()
export class GetPaymentStripeDashboardUrlApi extends BaseApiAdapter<string> {

	public override execute$() {
		return this.httpClient.get<string>(tenantPluginEndpointEnum.getPaymentStripeDashboardUrl);
	}

}
