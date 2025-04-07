import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IPayment} from "@tenant/payment/domain/interface/i.payment";

@Injectable()
export class PaymentDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IPayment.EntityRaw> {

	protected readonly columns = '_id,state,createdAt,updatedAt,orderId,anchorId,amount,status,paymentDate,providerType,currency,method';
	protected readonly moduleName = 'payment';
	protected readonly version = 1;

}
