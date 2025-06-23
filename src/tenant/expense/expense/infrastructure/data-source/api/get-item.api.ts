import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {IExpense} from "@tenant/expense/expense/domain";
import {expenseEndpointEnum} from "@tenant/expense/expense/infrastructure/endpoint/expense.endpoint";

@Injectable()
export class GetItemApi extends BaseApiAdapter<IExpense.DTO, [string]> {


	/**
	 * GET ITEM BY ID
	 * @param id
	 */
	public override execute$(id: string) {
		return this.httpClient.get<IExpense.EntityRaw>(expenseEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
		});
	}

}
