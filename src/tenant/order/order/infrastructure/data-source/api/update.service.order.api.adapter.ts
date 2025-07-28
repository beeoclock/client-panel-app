import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@tenant/order/order/infrastructure/endpoint/order.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";


@Injectable({
	providedIn: 'root'
})
export class UpdateServiceOrderApiAdapter extends BaseApiAdapter<IOrderService.DTO, [string, Partial<IOrderService.DTO>]> {

	/**
	 * @param orderId
	 * @param body
	 */
	public override execute$(orderId: string, body: Partial<IOrderService.DTO>) {
		return this.httpClient.patch<IOrderService.DTO>(OrderEndpoint.UPDATE_SERVICE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: orderId
			})
		});
	}

}
