import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import {environment} from "@environment/environment";
import EMemberContext from "@identity/domain/entity/e.member-context";
import {IMemberContext} from "@identity/domain/interface/i.member-context";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class MemberContextIndexedDBCollection extends Collection<IMemberContext.Entity> {
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
			transform: EMemberContext.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
