import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

@Injectable()
export class ExecuteFunctionApi extends BaseApiAdapter<object, [object, string, string]> {

	/**
	 * GET ITEM BY ID
	 * @param body
	 * @param pluginName
	 * @param functionName
	 */
	public override execute$(body: object, pluginName: string, functionName: string) {
		return this.httpClient.post<object>(tenantPluginEndpointEnum.executeFunction, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				pluginName,
				functionName,
			}),
		});
	}

}
