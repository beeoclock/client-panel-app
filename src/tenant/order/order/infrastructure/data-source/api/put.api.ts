import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@tenant/order/order/infrastructure/endpoint/order.endpoint";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";

@Injectable()
export class PutApi extends BaseApiAdapter<IOrder.DTO, [IOrder.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IOrder.DTO) {
		return this.httpClient.put<IOrder.DTO>(OrderEndpoint.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: body._id
			})
		});
	}

}
