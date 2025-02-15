import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {SyncManagerService} from "@core/system/infrastructure/database/_indexedDB/sync-manager.indexedDB.database";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@src/core/shared/checker";
import {filter} from "rxjs";
import EPayment from "@src/core/business-logic/payment/entity/e.payment";
import {PaymentEndpoint} from "@module/payment/infrastructure/endpoint/payment.endpoint";
import {
	PaymentIndexedDBCollection
} from "@module/payment/infrastructure/collection/indexedDB/payment.indexedDB.collection";

@Injectable({
	providedIn: 'root',
})
export class PaymentIndexedDBCollectionManager extends Reactive {

	private readonly syncManagerService = inject(SyncManagerService);
	private readonly tenantId$ = inject(TENANT_ID);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);

	// public readonly context = PaymentIndexedDBCollectionManagerContext.create(this.currentTenantId);
	public context!: PaymentIndexedDBCollectionManagerContext;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: PaymentIndexedDBCollectionManager,
	) {

		super();

		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((currentTenantId) => {


			this.context = PaymentIndexedDBCollectionManagerContext.create(currentTenantId);

			// Add collection to syncManager instance if you need to sync data with server
			const {collection, options, tenantId} = this.context.getSyncConfiguration();
			this.syncManagerService.addCollection(tenantId, collection, options);

		});

	}

}


class PaymentIndexedDBCollectionManagerContext {

	// Key is tenantId, value is PaymentCollection
	public static readonly register = new Map<string, PaymentIndexedDBCollectionManagerContext>();

	/**
	 * Database in indexedDB
	 */

	readonly #database!: {
		tenantId: string;
		collection: PaymentIndexedDBCollection;
	};

	public constructor(
		public readonly tenantId: string,
		public readonly createdByNew = true,
		public readonly collectionName = `signaldb-${tenantId}-payment`,
	) {
		if (this.createdByNew) {
			throw new Error('Use PaymentIndexedDBCollectionManagerContext.create()');
		}
		this.#database = {
			tenantId,
			collection: new PaymentIndexedDBCollection({
				tenantId,
				name: this.collectionName,
			}),
		};
		PaymentIndexedDBCollectionManagerContext.register.set(tenantId, this);
	}

	public static create(tenantId: string) {
		return (
			PaymentIndexedDBCollectionManagerContext.register.get(tenantId) ??
			new PaymentIndexedDBCollectionManagerContext(tenantId, false)
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
				toDTO: EPayment.toDTO,
				create: EPayment.create,
				endpoint: {
					get: PaymentEndpoint.PAGED,
					post: PaymentEndpoint.CREATE,
					put: PaymentEndpoint.UPDATE,
					delete: PaymentEndpoint.DELETE,
				}
			}
		};

	}

}
