import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {Types} from "@core/shared/types";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IService.DTO>, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IService.DTO>>(serviceEndpointEnum.paged, {
			params,
		});
	}

}
