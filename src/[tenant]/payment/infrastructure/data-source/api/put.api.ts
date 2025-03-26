import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {PaymentEndpoint} from "@[tenant]/payment/infrastructure/endpoint/payment.endpoint";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

@Injectable()
export class PutApi extends BaseApiAdapter<IPayment.DTO, [IPayment.DTO]> {

	/**
	 * @param body
	 */
	public override execute$(body: IPayment.DTO) {
		return this.httpClient.put<IPayment.DTO>(PaymentEndpoint.UPDATE, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: body._id
			})
		});
	}

}
