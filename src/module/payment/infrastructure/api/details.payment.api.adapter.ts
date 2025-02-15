import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {absenceEndpoint} from "@absence/infrastructure/endpoint/absence.endpoint";
import {IPaymentDto} from "@src/core/business-logic/payment/interface/i.payment";

@Injectable({
	providedIn: 'root'
})
export class DetailsPaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IPaymentDto>(absenceEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
