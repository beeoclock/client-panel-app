import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from '@core/shared/types';
import {IRole} from "@tenant/member/roles/domain";
import {roleEndpointEnum} from "@tenant/member/roles/infrastructure/endpoint/role.endpoint";

type ResponseType = ResponseListType<IRole.DTO>;

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseType, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseType>(roleEndpointEnum.paged, {
			params,
		});
	}

}
