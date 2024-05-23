import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@module/order/external/endpoint/order.endpoint";
import {IOrderDto} from "@order/external/interface/details/i.order.dto";
import {IUpdateOrderDto} from "@order/external/interface/update/i.update-order.dto";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
	providedIn: 'root'
})
export class UpdateOrderApiAdapter extends BaseApiAdapter<IOrderDto, [string, IUpdateOrderDto]> {

	/**
	 * @param id
	 * @param body
	 */
	public override execute$(id: string, body: IUpdateOrderDto) {
		return this.httpClient.put<IOrderDto>(OrderEndpoint.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {id})
		});
	}

}
