import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {expenseEndpointEnum} from "@tenant/expense/expense/infrastructure/endpoint/expense.endpoint";
import {IExpense} from "@tenant/expense/expense/domain";

@Injectable()
export class PutApi extends BaseApiAdapter<IExpense.DTO, [IExpense.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IExpense.DTO) {
		return this.httpClient.put<IExpense.EntityRaw>(expenseEndpointEnum.update, value, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: value._id,
			}),
		});
	}

}
