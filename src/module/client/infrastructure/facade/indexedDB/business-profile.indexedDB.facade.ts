import {inject, Injectable} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "@utility/checker";
import {
	BusinessProfileIndexedDBCollectionManager
} from "@client/infrastructure/manager/business-profile.indexedDB.collection.manager";
import {
	BusinessProfileIndexedDBCollection
} from "@client/infrastructure/collection/indexedDB/business-profile.indexedDB.collection";

@Injectable({
	providedIn: 'root',
})
export class BusinessProfileIndexedDBFacade extends Reactive {

	private readonly businessProfileIndexedDBCollectionManager = inject(BusinessProfileIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.businessProfileIndexedDBCollectionManager.context.database;
	#source!: BusinessProfileIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			this.#source = this.businessProfileIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
