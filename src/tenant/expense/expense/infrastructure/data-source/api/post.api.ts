import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {IExpense} from "@tenant/expense/expense/domain";
import {expenseEndpointEnum} from "@tenant/expense/expense/infrastructure/endpoint/expense.endpoint";

@Injectable()
export class PostApi extends BaseApiAdapter<IExpense.DTO, [IExpense.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IExpense.DTO) {
		return this.httpClient.post<IExpense.EntityRaw>(expenseEndpointEnum.create, value);
	}

}
