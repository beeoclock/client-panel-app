import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ICustomer} from "@core/business-logic/customer";

@Injectable()
export class CustomerDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ICustomer.Entity> {

	protected readonly columns = '_id,createdAt,updatedAt,firstName,lastName,email,phone';
	protected readonly moduleName = 'customer';
	protected readonly version = 1;

}
