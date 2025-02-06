import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {SyncManagerService} from "@src/core/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";
import {filter} from "rxjs";
import {OrderIndexedDBCollection} from "@order/infrastructure/collection/indexedDB/order.indexedDB.collection";
import {OrderEndpoint} from "@order/infrastructure/endpoint/order.endpoint";
import EOrder from "@order/domain/entity/e.order";

@Injectable({
	providedIn: 'root',
})
export class OrderIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = OrderIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: OrderIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: OrderIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = OrderIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class OrderIndexedDBCollectionManagerContext {

	// Key is tenantId, value is OrderCollection
	public static readonly register = new Map<string, OrderIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: OrderIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-order`,
	) {
		if (this.createdByNew) {
			throw new Error('Use OrderIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new OrderIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		OrderIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			OrderIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new OrderIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EOrder.toDTO,
				create: EOrder.create,
				endpoint: {
					get: OrderEndpoint.PAGED,
					post: OrderEndpoint.CREATE,
					put: OrderEndpoint.UPDATE,
					delete: OrderEndpoint.DELETE,
				}
			}
		};

	}

}
