import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

type response = {
	url: string
};

@Injectable()
export class PostPaymentStripeDashboardUrlApi extends BaseApiAdapter<response> {

	public override execute$() {
		return this.httpClient.post<response>(tenantPluginEndpointEnum.postPaymentStripeDashboardUrl, null);
	}

}
