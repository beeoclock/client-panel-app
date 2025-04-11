import {inject, Injectable} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {
	PaymentDexieAdapterIndexedDBDataProvider
} from "@tenant/order/payment/infrastructure/data-provider/indexedDB/adapter/payment.dexie.adapter.indexedDB.data-provider";
import EPayment from "@tenant/order/payment/domain/entity/e.payment";
import {DateTime, DateTimeUnit} from "luxon";
import {Types} from "@core/shared/types";

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

	public override find$(options: Types.FindQueryParams, filterFunction: ((entity: EPayment, filter: Types.FindQueryParams) => boolean) = this.defaultFilter.bind(this)) {
		return super.find$(options, (entity: EPayment, filter: Types.FindQueryParams & {
			dateRange?: {
				interval: DateTimeUnit;
				selectedDate: string;
			};
		}) => {
			const {dateRange, ...otherFilter} = filter;

			let result = filterFunction(entity, otherFilter);

			if (result && dateRange?.selectedDate && dateRange?.interval) {

				const {paymentDate} = entity;

				if (paymentDate) {

					const {interval, selectedDate} = dateRange;

					const startDateTime = DateTime.fromISO(selectedDate).startOf(interval).toJSDate().toISOString();
					const endDateTime = DateTime.fromISO(selectedDate).endOf(interval).toJSDate().toISOString();

					result = paymentDate >= startDateTime && paymentDate <= endDateTime;

				}

			}

			return result;
		});
	}

}
