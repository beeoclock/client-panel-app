import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";
import {OrderEndpoint} from "@tenant/order/order/infrastructure/endpoint/order.endpoint";

@Injectable()
export class GetItemApi extends BaseApiAdapter<IOrder.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IOrder.DTO>(OrderEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
