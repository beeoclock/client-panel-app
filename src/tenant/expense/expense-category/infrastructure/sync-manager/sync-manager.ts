import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/expense/expense-category/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";
import {
	ExpenseCategoryRepository
} from "@tenant/expense/expense-category/infrastructure/repository/expense-category.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IExpenseCategory.DTO, EExpenseCategory> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ExpenseCategoryRepository);
	protected readonly toEntity = EExpenseCategory.fromDTO;

	public constructor() {
		super('expenseCategory');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
