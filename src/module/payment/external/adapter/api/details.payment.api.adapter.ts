import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {AbsenceEndpoint} from "@module/absence/external/endpoint/absence.endpoint";
import {IPaymentDto} from "@module/payment/domain/interface/dto/i.payment.dto";

@Injectable({
	providedIn: 'root'
})
export class DetailsPaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IPaymentDto>(AbsenceEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
