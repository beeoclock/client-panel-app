import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class PostApi extends BaseApiAdapter<IServiceDto, [IService.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IService.DTO) {
		return this.httpClient.post<IService.DTO>(serviceEndpointEnum.create, value);
	}

}
