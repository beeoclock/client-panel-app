import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {HttpContext} from '@angular/common/http';
import {TokensHttpContext} from '@src/tokens.http-context';
import {customerEndpointEnum} from "@module/customer";

type ResponseType = {
	deletedCount: number
};

@Injectable()
export class RemoveCustomerApi extends BaseApiAdapter<ResponseType, [string]> {

	/**
	 * DELETE ITEM BY ID
	 * @param id
	 */
	@TypeGuard([is.string])
	public override execute$(id: string) {
		return this.httpClient.delete<ResponseType>(customerEndpointEnum.delete, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
