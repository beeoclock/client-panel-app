import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {IExpense} from "@tenant/expense/expense/domain";
import {expenseEndpointEnum} from "@tenant/expense/expense/infrastructure/endpoint/expense.endpoint";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IExpense.EntityRaw>, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IExpense.EntityRaw>>(expenseEndpointEnum.paged, {
			params,
		});
	}

}
