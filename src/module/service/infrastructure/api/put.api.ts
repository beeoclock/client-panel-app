import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class PutApi extends BaseApiAdapter<IService.DTO, [IService.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IService.DTO) {
		return this.httpClient.put<IService.DTO>(serviceEndpointEnum.update, value, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: value._id,
			}),
		});
	}

}
