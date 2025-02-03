import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {CURRENT_TENANT_ID} from "@src/token";
import {CustomerIndexedDBCollection} from "@customer/infrastructure/collection/indexedDB/customer.indexedDB.collection";
import ECustomer from "@customer/domain/entity/e.customer";
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {SyncManagerService} from "@src/core/infrastructure/database/indexedDB/sync-manager.indexedDB.database";

@Injectable()
export class CustomerIndexedDBCollectionManager {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	public readonly context = CustomerIndexedDBCollectionManagerContext.create(this.currentTenantId);

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: SyncManagerService,
	) {

		if (otherInstance) {
			throw new Error('SyncManagerService is already provided');
		}

		// Add collection to syncManager instance if you need to sync data with server
		const {collection, options} = this.context.getSyncConfiguration();
		this.syncManagerService.getSyncManager().addCollection(collection, options);
		this.syncManagerService.getSyncManager().syncAll();
	}

}


class CustomerIndexedDBCollectionManagerContext {

	// Key is tenantId, value is CustomerCollection
	public static readonly register = new Map<string, CustomerIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: CustomerIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-customer`,
	) {
		if (this.createdByNew) {
			throw new Error('Use CustomerIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new CustomerIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		CustomerIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			CustomerIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new CustomerIndexedDBCollectionManagerContext(tenantId, false)
		);
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
