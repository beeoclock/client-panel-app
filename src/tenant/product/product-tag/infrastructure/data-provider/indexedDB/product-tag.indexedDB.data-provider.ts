import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import EProductTag from "@tenant/product/product-tag/domain/entity/e.product-tag";
import {
	ProductTagDexieAdapterIndexedDBDataProvider
} from "@tenant/product/product-tag/infrastructure/data-provider/indexedDB/adapter/product-tag.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class ProductTagIndexedDBDataProvider extends IndexedDBDataProvider<EProductTag> {

	protected readonly entityFieldsToSearch = [
		'name',
	];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ProductTagDexieAdapterIndexedDBDataProvider);

}
