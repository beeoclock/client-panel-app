import {Injectable} from '@angular/core';
import {
	DexieAdapterIndexedDBDataProvider
} from "@core/system/infrastructure/data-provider/adapter/dexie/dexie.adapter.indexedDB.data-provider";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";

@Injectable()
export class PaymentDexieAdapterIndexedDBDataProvider extends DexieAdapterIndexedDBDataProvider<IPayment.Entity> {

	protected readonly columns = '_id,createdAt,updatedAt';
	protected readonly moduleName = 'payment';
	protected readonly version = 1;

}
