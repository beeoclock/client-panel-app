import {inject, Injectable} from "@angular/core";
import {TENANT_ID} from "@src/token";

@Injectable()
export class CustomerIndexedDBRepository {


	private readonly tenantId$ = inject(TENANT_ID);

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

	public constructor() {
		this.tenantId$.value
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
