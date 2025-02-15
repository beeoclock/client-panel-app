import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IPaymentDto} from "@src/core/business-logic/payment/interface/i.payment";
import {PaymentEndpoint} from "@module/payment/infrastructure/endpoint/payment.endpoint";

@Injectable({
	providedIn: 'root'
})
export class UpdatePaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [IPaymentDto]> {

	/**
	 * @param body
	 */
	public override execute$(body: IPaymentDto) {
		return this.httpClient.put<IPaymentDto>(PaymentEndpoint.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: body._id
			})
		});
	}

}
