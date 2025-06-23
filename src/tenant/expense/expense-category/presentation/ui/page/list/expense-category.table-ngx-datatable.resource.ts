import {inject, Injectable} from "@angular/core";
import {
	AsyncLoadDataFunctionParams,
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {SharedUow} from "@core/shared/uow/shared.uow";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

@Injectable()
export class ExpanseCategoryTableNgxDatatableSmartResource extends TableNgxDatatableSmartResource<IExpenseCategory.EntityRaw> {

	private readonly sharedUow = inject(SharedUow);

	protected override loadData(parameters: AsyncLoadDataFunctionParams) {

		return this.sharedUow.expenseCategory.repository.findAsync(parameters);

	}

}
