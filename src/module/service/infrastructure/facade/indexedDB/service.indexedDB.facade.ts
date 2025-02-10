import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "@utility/checker";
import {ServiceIndexedDBCollection} from "@service/infrastructure/collection/indexedDB/service.indexedDB.collection";
import {ServiceIndexedDBCollectionManager} from "@service/infrastructure/manager/service.indexedDB.collection.manager";

@Injectable({
	providedIn: 'root',
})
export class ServiceIndexedDBFacade extends Reactive {

	private readonly serviceIndexedDBCollectionManager = inject(ServiceIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.serviceIndexedDBCollectionManager.context.database;
	#source!: ServiceIndexedDBCollection;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: ServiceIndexedDBFacade,
	) {
		super();

		if (otherInstance) {
			/**
			 * ServiceIndexedDBFacade is already provided
			 */
			return otherInstance;
		}
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			this.#source = this.serviceIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
