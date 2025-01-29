import {ABaseItem} from "@src/core/abstract/a.base-item";
import {Tools} from "@utility/tools";
import {signalStore, withState} from "@ngrx/signals";
import {ICustomer} from "@src/core/interface/i.customer";
import angularReactivityAdapter from '@signaldb/angular';
import indexedDBAdapterPersistenceSignalDB
	from "@src/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";
import {IBaseItem} from "@core/interface/i.base-item";
import {Collection} from '@signaldb/core';
import {syncManagerConfigurationRegister} from "@src/database/tenant/signaldb/sync-manager.tenant.signaldb.database";
import {customerEndpointEnum} from "@customer/endpoint/customer.endpoint";

type IECustomer = IBaseItem<'CustomerDto'>;

class CustomerCollection extends Collection<IECustomer> {
	public constructor(params: { tenantId: string, name: string }) {
		const {name} = params;
		super({
			name,
			reactivity: angularReactivityAdapter,
			persistence: indexedDBAdapterPersistenceSignalDB({
				databaseName: name,
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

export class ECustomer extends ABaseItem<'CustomerDto'> implements IECustomer {

	// Implement to find customer with the same lastName
	public getNamesake() {
		const {lastName, id} = this as unknown as IECustomer;
		// Not me but with the same lastName
		console.log('namesakes', {lastName})
		return ECustomer.database.find({
			lastName,
			_id: {
				$ne: id,
			},
		})
	}

	public static collectionName = 'customer';

	public static toDTO(data: IECustomer): ICustomer {
		const {id, ...rest} = data;
		return rest as unknown as ICustomer;
	}

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

		this.collectionName = `${tenantId}-customer`;

		const collection = new CustomerCollection({
			tenantId,
			name: this.collectionName,
		});

		this.#database = {
			tenantId,
			collection,
		};

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

	public static getSyncConfiguration() {

		if (!this.#database) {
			throw new Error('Database is not initialized');
		}

		const {collection} = this.#database;

		return {
			collection,
			options: {
				name: this.collectionName,
				toDTO: this.toDTO,
				create: this.create,
				endpoint: {
					get: customerEndpointEnum.paged,
					post: customerEndpointEnum.create,
					put: customerEndpointEnum.update,
					delete: customerEndpointEnum.delete,
				}
			}
		};

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

syncManagerConfigurationRegister.push(ECustomer.getSyncConfiguration.bind(ECustomer) as never);

export default ECustomer;
