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
					keyPath: 'id', // should be id (not _id) because syncManager uses id
					autoIncrement: false,
				},
				indexes: [
					// {
					// 	name: 'customerType',
					// 	keyPath: 'raw.customerType',
					// 	options: {
					// 		unique: false
					// 	}
					// }
				]
			}),
			transform: ECustomer.create,
		})
	}

	/**
	 * Here you can declare methods for this collection
	 */

	public getRegular() {
		return this.find({
			customerType: 'regular',
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
	public static create(data: IECustomer): ECustomer {
		return new ECustomer(data);
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
		force ||= !this.databasePreparedFor(tenantId);

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


		if (!this.#database) {
			return false;
		}

		syncManager.addCollection(
			this.#database.collection,
			{
				name: this.collectionName,
				apiPath: 'api/v1/customer',
				create: this.create
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
