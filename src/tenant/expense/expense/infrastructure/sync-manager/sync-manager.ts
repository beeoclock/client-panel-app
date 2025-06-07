import {inject, Injectable} from "@angular/core";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {ApiDataProvider} from "@tenant/expense/expense/infrastructure/data-provider/api.data-provider";
import {TENANT_ID} from "@src/token";
import {filter, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {IExpense} from "@tenant/expense/expense/domain";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";
import {ExpenseRepository} from "@tenant/expense/expense/infrastructure/repository/expense.repository";

@Injectable()
export class SyncManager extends BaseSyncManager<IExpense.DTO, EExpense> {

	protected readonly apiDataProvider = inject(ApiDataProvider);
	protected readonly repository = inject(ExpenseRepository);
	protected readonly toEntity = EExpense.fromDTO;

	public constructor() {
		super('expense');
		inject(TENANT_ID).pipe(
			takeUntilDestroyed(),
			filter(is.string),
			tap(this.setTenantId.bind(this))
		).subscribe();
	}

}
