import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {customerEndpointEnum, ICustomer} from "@module/customer";

@Injectable()
export class ItemCustomerApi extends BaseApiAdapter<ICustomer.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<ICustomer.DTO>(customerEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
