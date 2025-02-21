import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	CustomerDexieAdapterIndexedDBDataProvider
} from "@customer/infrastructure/data-provider/indexedDB/adapter/customer.dexie.adapter.indexedDB.data-provider";
import ECustomer from "@core/business-logic/customer/entity/e.customer";

@Injectable()
export class CustomerIndexedDBDataProvider extends IndexedDBDataProvider<ECustomer> {

	protected readonly entityFieldsToSearch = ['note', 'firstName', 'lastName', 'email', 'phone'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(CustomerDexieAdapterIndexedDBDataProvider);

}
