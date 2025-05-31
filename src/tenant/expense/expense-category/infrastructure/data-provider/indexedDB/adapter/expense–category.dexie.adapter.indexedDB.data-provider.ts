import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IExpenseCategory} from "@tenant/expense/expense-category/domain";

@Injectable()
export class ExpenseCategoryDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IExpenseCategory.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'expenseCategory';
	protected readonly version = 1;

}
