import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	ExpenseDexieAdapterIndexedDBDataProvider
} from "@tenant/expense/expense/infrastructure/data-provider/indexedDB/adapter/expense.dexie.adapter.indexedDB.data-provider";
import EExpense from "@tenant/expense/expense/domain/entity/e.expense";

@Injectable()
export class ExpenseIndexedDBDataProvider extends IndexedDBDataProvider<EExpense> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ExpenseDexieAdapterIndexedDBDataProvider);

}
