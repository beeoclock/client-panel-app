import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {
	SyncManagerService
} from "../../../../../core/system/infrastructure/database/indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "../../../../../core/shared/checker";
import {filter} from "rxjs";
import {MemberIndexedDBCollection} from "@member/infrastructure/collection/indexedDB/member.indexedDB.collection";
import EMember from "../../../../../core/business-logic/member/entity/e.member";
import {memberEndpointEnum} from "@member/infrastructure/endpoint/member.endpoint";

@Injectable({
	providedIn: 'root',
})
export class MemberIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = MemberIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: MemberIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: MemberIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = MemberIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class MemberIndexedDBCollectionManagerContext {

	// Key is tenantId, value is MemberCollection
	public static readonly register = new Map<string, MemberIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: MemberIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-member`,
	) {
		if (this.createdByNew) {
			throw new Error('Use MemberIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new MemberIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		MemberIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			MemberIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new MemberIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EMember.toDTO,
				create: EMember.create,
				endpoint: {
					get: memberEndpointEnum.paged,
					post: memberEndpointEnum.create,
					put: memberEndpointEnum.update,
					delete: memberEndpointEnum.delete,
				}
			}
		};

	}

}
