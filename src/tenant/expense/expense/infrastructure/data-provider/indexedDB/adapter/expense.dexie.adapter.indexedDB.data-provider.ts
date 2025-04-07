import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IExpense} from "@tenant/expense/expense/domain";

@Injectable()
export class ExpenseDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IExpense.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'expense';
	protected readonly version = 1;

}
