import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import EProduct from "@tenant/product/product/domain/entity/e.product";
import {
	ProductDexieAdapterIndexedDBDataProvider
} from "@tenant/product/product/infrastructure/data-provider/indexedDB/adapter/product.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class ProductIndexedDBDataProvider extends IndexedDBDataProvider<EProduct> {

	protected readonly entityFieldsToSearch = [
		'languageVersions.title',
		'languageVersions.description',
		'sku',
	];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(ProductDexieAdapterIndexedDBDataProvider);

}
