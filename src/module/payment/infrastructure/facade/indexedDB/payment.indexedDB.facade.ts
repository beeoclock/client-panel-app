import {inject, Injectable} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "../../../../../../core/shared/checker";
import {
	PaymentIndexedDBCollectionManager
} from "@module/payment/infrastructure/manager/payment.indexedDB.collection.manager";
import {
	PaymentIndexedDBCollection
} from "@module/payment/infrastructure/collection/indexedDB/payment.indexedDB.collection";

@Injectable({
	providedIn: 'root',
})
export class PaymentIndexedDBFacade extends Reactive {

	private readonly paymentIndexedDBCollectionManager = inject(PaymentIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.serviceIndexedDBCollectionManager.context.database;
	#source!: PaymentIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			this.#source = this.paymentIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
