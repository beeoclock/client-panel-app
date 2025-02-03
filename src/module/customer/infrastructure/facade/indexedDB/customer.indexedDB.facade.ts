import {inject, Injectable} from "@angular/core";
import {
	CustomerIndexedDBCollectionManager
} from "@customer/infrastructure/manager/customer.indexedDB.collection.manager";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "@utility/checker";
import {CustomerIndexedDBCollection} from "@customer/infrastructure/collection/indexedDB/customer.indexedDB.collection";

@Injectable({
	providedIn: 'root',
})
export class CustomerIndexedDBFacade extends Reactive {

	private readonly customerIndexedDBCollectionManager = inject(CustomerIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.customerIndexedDBCollectionManager.context.database;
	#source!: CustomerIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			console.log('CustomerIndexedDBFacade', {tenantId});
			this.#source = this.customerIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
