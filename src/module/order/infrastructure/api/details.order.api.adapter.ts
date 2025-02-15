import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IOrderDto} from "../../../../../core/business-logic/order/interface/details/i.order.dto";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";

@Injectable({
	providedIn: 'root'
})
export class DetailsOrderApiAdapter extends BaseApiAdapter<IOrderDto, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IOrderDto>(OrderEndpoint.DETAILS, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
