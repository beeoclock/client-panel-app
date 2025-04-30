import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	CustomerDexieAdapterIndexedDBDataProvider
} from "@tenant/customer/infrastructure/data-provider/indexedDB/adapter/customer.dexie.adapter.indexedDB.data-provider";
import ECustomer from "@tenant/customer/domain/entity/e.customer";

@Injectable()
export class CustomerIndexedDBDataProvider extends IndexedDBDataProvider<ECustomer> {

	protected readonly entityFieldsToSearch = ['note', 'firstName', 'lastName', 'email', 'phone'];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(CustomerDexieAdapterIndexedDBDataProvider);

}
