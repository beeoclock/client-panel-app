import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {tenantPluginEndpointEnum} from "@tenant/plugin/tenant-plugin/infrastructure/endpoint/tenant-plugin.endpoint";

@Injectable()
export class AttachPluginApi extends BaseApiAdapter<void, [object]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: object) {
		return this.httpClient.patch<void>(tenantPluginEndpointEnum.attachPlugin, value);
	}

}
