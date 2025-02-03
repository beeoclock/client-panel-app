import {Collection} from "@signaldb/core/index";
import {customerEndpointEnum, CustomerTypeEnum, ECustomer, ICustomer} from "@customer";
import angularReactivityAdapter from "@signaldb/angular/index";
import indexedDBAdapterPersistenceSignalDB
	from "@core/infrastructure/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";

// It is a repository for customers
class CustomerCollection extends Collection<ICustomer.Entity> {
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
				}
			}),
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

/**
 * TODO: Change it into abstract class
 */
export default class CustomerIndexedDBRepository {

	// Key is tenantId, value is CustomerCollection
	public static readonly registerCollectionPerTenantId = new Map<string, CustomerCollection>();
	public static readonly register = new Map<string, CustomerIndexedDBRepository>();

	public readonly collectionName = `customer`;

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: CustomerCollection;
	};

	public constructor(
		public readonly tenantId: string
	) {
		this.collectionName.concat(`-${tenantId}`);
		let collection = CustomerIndexedDBRepository.registerCollectionPerTenantId.get(tenantId);
		if (!collection) {
			collection = CustomerIndexedDBRepository.getCollection(this.tenantId, this.collectionName);
			CustomerIndexedDBRepository.registerCollectionPerTenantId.set(this.tenantId, collection);
		}
		this.#database = {
			tenantId,
			collection,
		};
		CustomerIndexedDBRepository.register.set(tenantId, this);
	}

	public static getCollection(tenantId: string, name: string) {

		const collection = new CustomerCollection({
			tenantId,
			name,
		});

		return collection;
	}

	/**
	 * Use for factory pattern at wrapper-panel.component.ts
	 * @param tenantId
	 */
	public static createOrGetExist(tenantId: string) {
		return CustomerIndexedDBRepository.register.get(tenantId) ?? new CustomerIndexedDBRepository(tenantId);
	}

	public get database() {
		return this.#database.collection;
	}

	public getSyncConfiguration() {

		if (!this.#database) {
			throw new Error('Database is not initialized');
		}

		const {collection} = this.#database;

		return {
			collection,
			options: {
				name: this.collectionName,
				toDTO: ECustomer.toDTO,
				create: ECustomer.create,
				endpoint: {
					get: customerEndpointEnum.paged,
					post: customerEndpointEnum.create,
					put: customerEndpointEnum.update,
					delete: customerEndpointEnum.delete,
				}
			}
		};

	}

}
