import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import EAbsence from "@src/core/business-logic/absence/entity/e.absence";
import {IAbsence} from "@src/core/business-logic/absence/interface/i.absence";
import {environment} from "@environment/environment";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class AbsenceIndexedDBCollection extends Collection<IAbsence.Entity> {
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
			transform: EAbsence.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
