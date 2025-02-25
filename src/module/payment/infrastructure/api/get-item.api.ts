import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IPayment} from "@src/core/business-logic/payment/interface/i.payment";
import {PaymentEndpoint} from "@module/payment/infrastructure/endpoint/payment.endpoint";

@Injectable()
export class GetItemApi extends BaseApiAdapter<IPayment.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IPayment.DTO>(PaymentEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
