import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@tenant/payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";
import EPayment from "@tenant/payment/domain/entity/e.payment";

@Injectable()
export class PaymentIndexedDBDataProvider extends IndexedDBDataProvider<EPayment> {

	protected readonly entityFieldsToSearch = [
		'amount',
		'method',
		'status',
		'paymentDate',
		'providerType',
		'orderId',
		'payer.firstName',
		'payer.lastName',
		'payer.phone',
		'payer.email',
		'payer.note'
	];
	protected readonly dexieAdapterIndexedDBDataProvider = inject(PaymentDexieAdapterIndexedDBDataProvider);

}
