import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import EOrderService from "@tenant/order-service/domain/entity/e.order-service";
import {
	OrderServiceDexieAdapterIndexedDBDataProvider
} from "@tenant/order-service/infrastructure/data-provider/indexedDB/adapter/order-service.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class OrderServiceIndexedDBDataProvider extends IndexedDBDataProvider<EOrderService> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(OrderServiceDexieAdapterIndexedDBDataProvider);

}
