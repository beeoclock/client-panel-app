import {ABaseItem} from "@src/core/abstract/a.base-item";
import {Tools} from "@utility/tools";
import {signalStore, withState} from "@ngrx/signals";
import {ICustomer} from "@src/core/interface/i.customer";
import angularReactivityAdapter from '@signaldb/angular';
import indexedDBAdapterPersistenceSignalDB
	from "@src/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";
import {IBaseItem} from "@core/interface/i.base-item";
import {Collection} from '@signaldb/core';
import {syncManager} from "@src/database/tenant/signaldb/sync-manager.tenant.signaldb.database";

type IECustomer = IBaseItem<ICustomer>;

class CustomerCollection extends Collection<IECustomer> {
	public constructor(params: { tenantId: string, name: string }) {
		const {tenantId, name} = params;
		super({
			name,
			reactivity: angularReactivityAdapter,
			persistence: indexedDBAdapterPersistenceSignalDB({
				databaseName: `${tenantId}-${name}`,
				storeName: 'items',
				version: 1,
				storeParameters: {
					keyPath: 'id',
					autoIncrement: false,
				}
			}),
			transform: ECustomer.transform,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */

	// public getPublishedPosts() {
	// 	return this.find({published: true})
	// }

}

const store = signalStore(
	{providedIn: 'root'},
	withState({}),
);

export class ECustomer extends ABaseItem<ICustomer> implements IECustomer {

	public static readonly collectionName = 'customer';

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: ICustomer): ECustomer {
		return new ECustomer(data);
	}

	/**
	 * Use it to transform data from database to entity
	 * @param data
	 */
	public static transform(data: IECustomer): ECustomer {
		return new ECustomer(data.raw);
	}

	/**
	 * Database in indexedDB
	 */

	static #database: {
		tenantId: string;
		collection: CustomerCollection;
	};

	/**
	 *
	 * @param tenantId
	 * @param force
	 */
	public static initDatabase(tenantId: string, force = false) {
		console.log('ECustomer:initDatabase:force', {force});

		force ||= !this.databasePreparedFor(tenantId);

		console.log('ECustomer:initDatabase:force', {force});

		if (!force) {

			return 'exists';

		}

		const collection = new CustomerCollection({
			tenantId,
			name: this.collectionName,
		});

		this.#database = {
			tenantId,
			collection,
		};

		this.registerSync();

		return 'created';
	}

	/**
	 *
	 * @param tenantId
	 */
	public static databasePreparedFor(tenantId: string) {
		return !!this.#database && this.#database.tenantId === tenantId;
	}

	public static get database() {
		return this.#database.collection;
	}

	public static registerSync() {

		console.log('ECustomer:registerSync');

		if (!this.#database) {
			console.log('ECustomer:registerSync:result:false');
			return false;
		}

		console.log('ECustomer:registerSync:result:true');

		syncManager.addCollection(
			this.#database.collection,
			{
				name: this.collectionName,
				apiPath: 'api/v1/customer',
			}
		);

		return true;
	}

	/**
	 * RAM store
	 */

	public static readonly store = store;

	/**
	 * Tools
	 */

	public static readonly is = {
		raw: Tools.createIs<ICustomer>(),
		entity: Tools.createIs<IECustomer>(),
	};
	public static readonly isValid = {
		raw: Tools.createValidate<ICustomer>(),
		entity: Tools.createValidate<IECustomer>(),
	};
	public static readonly getRandom = {
		raw: Tools.createRandom<ICustomer>(),
		entity: Tools.createRandom<IECustomer>(),
	};

}

export default ECustomer;
