import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {OrderEndpoint} from "@module/order/external/endpoint/order.endpoint";
import {ICreateOrderDto} from '../../interface/create/i.create-order.dto';
import {IOrderDto} from "@order/external/interface/details/i.order.dto";

@Injectable({
	providedIn: 'root'
})
export class CreateOrderApiAdapter extends BaseApiAdapter<IOrderDto, [ICreateOrderDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: ICreateOrderDto) {
		return this.httpClient.post<IOrderDto>(OrderEndpoint.CREATE, body);
	}

}
