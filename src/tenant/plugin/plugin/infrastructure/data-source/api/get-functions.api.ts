import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {pluginEndpointEnum} from "@tenant/plugin/plugin/infrastructure/endpoint/plugin.endpoint";

@Injectable()
export class GetFunctions extends BaseApiAdapter<object, [string, string]> {


	/**
	 * GET ITEM BY ID
	 * @param pluginName
	 * @param functionName
	 */
	public override execute$(pluginName: string, functionName: string) {
		return this.httpClient.get<object>(pluginEndpointEnum.pluginFunction, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				pluginName,
				functionName,
			}),
		});
	}

}
