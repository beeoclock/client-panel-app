import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {SyncManagerService} from "@src/core/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";
import {filter} from "rxjs";
import {AbsenceIndexedDBCollection} from "@absence/infrastructure/collection/indexedDB/absence.indexedDB.collection";
import EAbsence from "@absence/domain/entity/e.absence";
import {absenceEndpointEnum} from "@absence/infrastructure/endpoint/absenceEndpointEnum";

@Injectable({
	providedIn: 'root',
})
export class AbsenceIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = AbsenceIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: AbsenceIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: AbsenceIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = AbsenceIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class AbsenceIndexedDBCollectionManagerContext {

	// Key is tenantId, value is AbsenceCollection
	public static readonly register = new Map<string, AbsenceIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: AbsenceIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-absence`,
	) {
		if (this.createdByNew) {
			throw new Error('Use AbsenceIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new AbsenceIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		AbsenceIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			AbsenceIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new AbsenceIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EAbsence.toDTO,
				create: EAbsence.create,
				endpoint: {
					get: absenceEndpointEnum.PAGED,
					post: absenceEndpointEnum.CREATE,
					put: absenceEndpointEnum.UPDATE,
					delete: absenceEndpointEnum.DELETE,
				}
			}
		};

	}

}
