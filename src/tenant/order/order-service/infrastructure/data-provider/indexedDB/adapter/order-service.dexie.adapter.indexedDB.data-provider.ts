import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IOrderService} from "@tenant/order/order-service/domain/interface/i.order-service.dto";

@Injectable()
export class OrderServiceDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IOrderService.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,status,orderId,orderAppointmentDetails.end,orderAppointmentDetails.start';
	protected readonly moduleName = 'order-service';
	protected readonly version = 1;

}
