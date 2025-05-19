import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

@Injectable()
export class DetachPluginApi extends BaseApiAdapter<void, [string]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param slug
	 */
	@TypeGuard([is.string])
	public override execute$(slug: string) {
		return this.httpClient.patch<void>(tenantPluginEndpointEnum.detachPlugin, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				pluginName: slug,
			}),
		});
	}

}
