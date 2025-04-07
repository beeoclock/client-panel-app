import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	ExpenseCategoryDexieAdapterIndexedDBDataProvider
} from "@tenant/expense/expense-category/infrastructure/data-provider/indexedDB/adapter/expense–category.dexie.adapter.indexedDB.data-provider";
import EExpenseCategory from "@tenant/expense/expense-category/domain/entity/e.expense-category";

@Injectable()
export class ExpenseCategoryIndexedDBDataProvider extends IndexedDBDataProvider<EExpenseCategory> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ExpenseCategoryDexieAdapterIndexedDBDataProvider);

}
