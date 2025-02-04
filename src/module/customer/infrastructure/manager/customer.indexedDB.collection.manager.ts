import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {CustomerIndexedDBCollection} from "@customer/infrastructure/collection/indexedDB/customer.indexedDB.collection";
import ECustomer from "@customer/domain/entity/e.customer";
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {SyncManagerService} from "@src/core/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";
import {filter} from "rxjs";

@Injectable({
	providedIn: 'root',
})
export class CustomerIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = CustomerIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: CustomerIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: SyncManagerService,
	) {

		super();

		if (otherInstance) {
			throw new Error('SyncManagerService is already provided');
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {

			console.log({currentTenantId})

			this.context = CustomerIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

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

		const {collection, tenantId} = this.#database;

		return {
			tenantId,
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
