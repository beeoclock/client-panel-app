import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import {IOrderDto} from "@src/core/business-logic/order/interface/details/i.order.dto";

@Injectable()
export class PostApi extends BaseApiAdapter<IOrderDto, [IOrderDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: IOrderDto) {
		return this.httpClient.post<IOrderDto>(OrderEndpoint.CREATE, body);
	}

}
