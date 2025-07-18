import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

@Injectable()
export class GetFunctionsApi extends BaseApiAdapter<object, [string]> {

	/**
	 * GET ITEM BY ID
	 * @param pluginName
	 */
	public override execute$(pluginName: string) {
		return this.httpClient.get<object>(tenantPluginEndpointEnum.getFunctions, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				pluginName,
			}),
		});
	}

}
