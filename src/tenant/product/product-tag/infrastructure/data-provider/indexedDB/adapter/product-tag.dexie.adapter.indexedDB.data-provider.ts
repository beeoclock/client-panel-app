import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IProductTag} from "@tenant/product/product-tag/domain";

@Injectable()
export class ProductTagDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IProductTag.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,name';
	protected readonly moduleName = 'product-tag';
	protected readonly version = 1;

}
