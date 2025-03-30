import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@tenant/service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IService} from "@core/business-logic/service/interface/i.service";

@Injectable()
export class GetItemApi extends BaseApiAdapter<IService.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.get<IService.DTO>(serviceEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
