import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IOrder} from "@tenant/order/domain/interface/i.order";

@Injectable()
export class OrderDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IOrder.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt';
	protected readonly moduleName = 'order';
	protected readonly version = 1;

}
