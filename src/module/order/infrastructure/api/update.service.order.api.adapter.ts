import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IOrderServiceDto} from "@src/core/business-logic/order/interface/i.order-service.dto";

@Injectable({
	providedIn: 'root'
})
export class UpdateServiceOrderApiAdapter extends BaseApiAdapter<IOrderServiceDto, [string, Partial<IOrderServiceDto>]> {

	/**
	 * @param orderId
	 * @param body
	 */
	public override execute$(orderId: string, body: Partial<IOrderServiceDto>) {
		return this.httpClient.patch<IOrderServiceDto>(OrderEndpoint.UPDATE_SERVICE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: orderId
			})
		});
	}

}
