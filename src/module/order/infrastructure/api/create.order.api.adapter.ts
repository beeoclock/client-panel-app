import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {IOrderDto} from "@order/domain/interface/details/i.order.dto";

@Injectable({
	providedIn: 'root'
})
export class CreateOrderApiAdapter extends BaseApiAdapter<IOrderDto, [IOrderDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: IOrderDto) {
		return this.httpClient.post<IOrderDto>(OrderEndpoint.CREATE, body);
	}

}
