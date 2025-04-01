import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {ICustomer} from "@tenant/customer/domain";

@Injectable()
export class ProductDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<ICustomer.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,firstName,lastName,email,phone';
	protected readonly moduleName = 'product';
	protected readonly version = 1;

}
