import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";
import {IPaymentDto} from "@module/payment/domain/interface/i.payment";

@Injectable({
	providedIn: 'root'
})
export class DetailsPaymentApiAdapter extends BaseApiAdapter<IPaymentDto, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IPaymentDto>(absenceEndpointEnum.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
