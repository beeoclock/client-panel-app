import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {PaymentEndpoint} from "@tenant/order/payment/infrastructure/endpoint/payment.endpoint";
import {IPayment} from "@tenant/order/payment/domain/interface/i.payment";

@Injectable()
export class PostApi extends BaseApiAdapter<IPayment.DTO, [IPayment.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IPayment.DTO) {

		return this.httpClient.post<IPayment.DTO>(PaymentEndpoint.CREATE, body);
	}

}
