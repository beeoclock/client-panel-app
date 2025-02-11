import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import EPayment from "@module/payment/domain/entity/e.payment";
import {IPayment} from "@module/payment/domain/interface/i.payment";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class PaymentIndexedDBCollection extends Collection<IPayment.Entity> {
	public constructor(params: { tenantId: string, name: string }) {
		const {name} = params;
		super({
			name,
			reactivity: angularReactivityAdapter,
			persistence: indexedDBPersistenceAdapter({
				databaseName: name,
				storeName: 'items',
				version: 1,
				storeParameters: {
					keyPath: 'id', // should be id (not _id) because syncManager uses id
					autoIncrement: false,
				}
			}),
			transform: EPayment.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
