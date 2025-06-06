import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@tenant/order/order/infrastructure/endpoint/order.endpoint";
import {IOrder} from "@tenant/order/order/domain/interface/i.order";

@Injectable()
export class PostApi extends BaseApiAdapter<IOrder.DTO, [IOrder.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IOrder.DTO) {
		return this.httpClient.post<IOrder.DTO>(OrderEndpoint.CREATE, body);
	}

}
