import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IOrder} from "@core/business-logic/order/interface/i.order";

@Injectable()
export class OrderDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IOrder.EntityRaw> {

	protected readonly columns = '_id,createdAt,updatedAt';
	protected readonly moduleName = 'order';
	protected readonly version = 1;

}
