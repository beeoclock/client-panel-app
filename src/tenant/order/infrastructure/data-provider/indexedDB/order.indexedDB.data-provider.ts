import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	OrderDexieAdapterIndexedDBDataProvider
} from "@tenant/order/infrastructure/data-provider/indexedDB/adapter/order.dexie.adapter.indexedDB.data-provider";
import EOrder from "@tenant/order/domain/entity/e.order";

@Injectable()
export class OrderIndexedDBDataProvider extends IndexedDBDataProvider<EOrder> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(OrderDexieAdapterIndexedDBDataProvider);

}
