import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import EOrder from "../../../../../../core/business-logic/order/entity/e.order";
import {IOrder} from "../../../../../../core/business-logic/order/interface/i.order";
import {environment} from "@environment/environment";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class OrderIndexedDBCollection extends Collection<IOrder.Entity> {
	public constructor(params: { tenantId: string, name: string }) {
		const {name} = params;
		super({
			name,
			enableDebugMode: !environment.production,
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
			transform: EOrder.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
