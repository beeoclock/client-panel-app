import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import {IService} from "../../../../../../core/business-logic/service/interface/i.service";
import EService from "../../../../../../core/business-logic/service/entity/e.service";
import {environment} from "@environment/environment";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class ServiceIndexedDBCollection extends Collection<IService.Entity> {
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
			transform: EService.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
