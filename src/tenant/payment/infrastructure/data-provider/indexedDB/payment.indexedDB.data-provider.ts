import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@tenant/payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";
import EPayment from "@core/business-logic/payment/entity/e.payment";

@Injectable()
export class PaymentIndexedDBDataProvider extends IndexedDBDataProvider<EPayment> {

	protected readonly entityFieldsToSearch = [];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(PaymentDexieAdapterIndexedDBDataProvider);

}
