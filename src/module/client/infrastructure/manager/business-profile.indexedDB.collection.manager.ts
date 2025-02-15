import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {SyncManagerService} from "@src/core/system/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@src/core/shared/checker";
import {filter} from "rxjs";
import EBusinessProfile from "@client/domain/entity/e.business-profile";
import {
	BusinessProfileIndexedDBCollection
} from "@client/infrastructure/collection/indexedDB/business-profile.indexedDB.collection";
import {businessProfileEndpointEnum} from "@client/infrastructure/endpoint/business-profile.endpoint";

@Injectable({
	providedIn: 'root',
})
export class BusinessProfileIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = BusinessProfileIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: BusinessProfileIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: BusinessProfileIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = BusinessProfileIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class BusinessProfileIndexedDBCollectionManagerContext {

	// Key is tenantId, value is BusinessProfileCollection
	public static readonly register = new Map<string, BusinessProfileIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: BusinessProfileIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-business-profile`,
	) {
		if (this.createdByNew) {
			throw new Error('Use BusinessProfileIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new BusinessProfileIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		BusinessProfileIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			BusinessProfileIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new BusinessProfileIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EBusinessProfile.toDTO,
				create: EBusinessProfile.create,
				single: true,
				endpoint: {
					get: businessProfileEndpointEnum.item,
					put: businessProfileEndpointEnum.update,
				}
			}
		};

	}

}
