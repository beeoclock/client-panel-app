import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IProduct} from "@tenant/product/domain";

@Injectable()
export class ProductDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IProduct.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'product';
	protected readonly version = 1;

}
