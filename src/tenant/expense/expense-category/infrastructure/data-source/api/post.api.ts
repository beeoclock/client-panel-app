import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {
	expenseCategoryEndpointEnum
} from "@tenant/expense/expense-category/infrastructure/endpoint/expense-category.endpoint";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

@Injectable()
export class PostApi extends BaseApiAdapter<IExpenseCategory.DTO, [IExpenseCategory.DTO]> {

	/**
	 * SAVE NEW ITEM OR UPDATE ITEM BY ID
	 * @param value
	 */
	@TypeGuard([is.object_not_empty])
	public override execute$(value: IExpenseCategory.DTO) {
		return this.httpClient.post<IExpenseCategory.EntityRaw>(expenseCategoryEndpointEnum.create, value);
	}

}
