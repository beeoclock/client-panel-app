import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ICustomer} from "@tenant/customer/domain";

@Injectable()
export class CustomerDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ICustomer.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,firstName,lastName,email,phone';
	protected readonly moduleName = 'customer';
	protected readonly version = 1;

}
