import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {ICustomer} from "@core/business-logic/customer";
import {
	CustomerDexieAdapterIndexedDBDataProvider
} from "@customer/infrastructure/data-provider/indexedDB/adapter/customer.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class CustomerIndexedDBDataProvider extends IndexedDBDataProvider<ICustomer.Entity> {

	protected readonly entityFieldsToSearch = ['note', 'firstName', 'lastName', 'email', 'phone'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(CustomerDexieAdapterIndexedDBDataProvider);

}
