import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IPayment} from "@core/business-logic/payment/interface/i.payment";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@module/payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";

@Injectable()
export class PaymentIndexedDBDataProvider extends IndexedDBDataProvider<IPayment.Entity> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(PaymentDexieAdapterIndexedDBDataProvider);

}
