import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {
	SyncManagerService
} from "../../../../../core/system/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "../../../../../core/shared/checker";
import {filter} from "rxjs";
import {ServiceIndexedDBCollection} from "@service/infrastructure/collection/indexedDB/service.indexedDB.collection";
import {serviceEndpointEnum} from "../endpoint/service.endpoint";
import EService from "../../../../../core/business-logic/service/entity/e.service";

@Injectable({
	providedIn: 'root',
})
export class ServiceIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = ServiceIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: ServiceIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: ServiceIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * ServiceIndexedDBCollectionManager is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = ServiceIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class ServiceIndexedDBCollectionManagerContext {

	// Key is tenantId, value is ServiceCollection
	public static readonly register = new Map<string, ServiceIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: ServiceIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-service`,
	) {
		if (this.createdByNew) {
			throw new Error('Use ServiceIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new ServiceIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		ServiceIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			ServiceIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new ServiceIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EService.toDTO,
				create: EService.create,
				endpoint: {
					get: serviceEndpointEnum.paged,
					post: serviceEndpointEnum.create,
					put: serviceEndpointEnum.update,
					delete: serviceEndpointEnum.delete,
				}
			}
		};

	}

}
