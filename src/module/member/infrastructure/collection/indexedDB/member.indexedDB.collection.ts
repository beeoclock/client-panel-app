import angularReactivityAdapter from "@signaldb/angular";
import {Collection} from "@signaldb/core";
import indexedDBPersistenceAdapter from "@src/packages/SignalDB/adapter/indexedDB.persistence.adapter";
import {IMember} from "@src/core/business-logic/member/interface/i.member";
import EMember from "@src/core/business-logic/member/entity/e.member";
import {environment} from "@environment/environment";

/**
 * Collection for Customer
 * Use this if you know what you are doing!
 *
 */
export class MemberIndexedDBCollection extends Collection<IMember.Entity> {
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
			transform: EMember.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */


}
