import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import {ICustomer} from "@customer/domain";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import ECustomer from "@customer/domain/entity/e.customer";
import {environment} from "@environment/environment";
import createIndexedDBAdapter from "@signaldb/indexeddb";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class CustomerIndexedDBCollection extends Collection<ICustomer.Entity> {
	public constructor(params: { tenantId: string, name: string }) {
		const {name} = params;
		super({
			name,
			enableDebugMode: !environment.production,
			reactivity: angularReactivityAdapter,
			persistence: createIndexedDBAdapter('customer'),
			// persistence: indexedDBPersistenceAdapter({
			// 	databaseName: name,
			// 	storeName: 'items',
			// 	version: 1,
			// 	storeParameters: {
			// 		keyPath: 'id', // should be id (not _id) because syncManager uses id
			// 		autoIncrement: false,
			// 	}
			// }),
			transform: ECustomer.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */

	public getRegular() {
		return this.find({
			customerType: CustomerTypeEnum.regular,
		})
	}

	public getNew() {
		return this.find({
			updatedAt: {
				$gte: "2025-01-28T21:00:01.095Z"
			},
		})
	}

}
