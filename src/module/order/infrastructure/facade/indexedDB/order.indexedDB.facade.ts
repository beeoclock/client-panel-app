import {inject, Injectable} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "@src/core/shared/checker";
import {OrderIndexedDBCollection} from "@order/infrastructure/collection/indexedDB/order.indexedDB.collection";
import {OrderIndexedDBCollectionManager} from "@order/infrastructure/manager/order.indexedDB.collection.manager";

@Injectable({
	providedIn: 'root',
})
export class OrderIndexedDBFacade extends Reactive {

	private readonly orderIndexedDBCollectionManager = inject(OrderIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.serviceIndexedDBCollectionManager.context.database;
	#source!: OrderIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			this.#source = this.orderIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
