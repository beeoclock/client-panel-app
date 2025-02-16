import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IOrder} from "@core/business-logic/order/interface/i.order";
import {
	OrderDexieAdapterIndexedDBDataProvider
} from "@order/infrastructure/data-provider/indexedDB/adapter/order.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class OrderIndexedDBDataProvider extends IndexedDBDataProvider<IOrder.Entity> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(OrderDexieAdapterIndexedDBDataProvider);

}
