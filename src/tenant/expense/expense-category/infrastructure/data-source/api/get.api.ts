import {Injectable} from '@angular/core';
import {BaseApiAdapter, ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {Types} from "@core/shared/types";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";
import {
	expenseCategoryEndpointEnum
} from "@tenant/expense/expense-category/infrastructure/endpoint/expense-category.endpoint";

@Injectable()
export class GetApi extends BaseApiAdapter<ResponseListType<IExpenseCategory.EntityRaw>, [Types.FindQueryParams]> {


	/**
	 * GET PAGED LIST BY FILTERS AND PARAMS
	 * @param params
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(params: Types.FindQueryParams) {
		return this.httpClient.get<ResponseListType<IExpenseCategory.EntityRaw>>(expenseCategoryEndpointEnum.paged, {
			params,
		});
	}

}
