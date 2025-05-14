import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {IPlugin} from "@tenant/plugin/plugin/domain";
import {pluginEndpointEnum} from "@tenant/plugin/plugin/infrastructure/endpoint/plugin.endpoint";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IPlugin.EntityRaw>, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IPlugin.EntityRaw>>(pluginEndpointEnum.paged, {
			params,
		});
	}

}
