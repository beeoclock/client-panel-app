import {inject, Injectable} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "@utility/checker";
import {AbsenceIndexedDBCollection} from "@absence/infrastructure/collection/indexedDB/absence.indexedDB.collection";
import {AbsenceIndexedDBCollectionManager} from "@absence/infrastructure/manager/absence.indexedDB.collection.manager";

@Injectable({
	providedIn: 'root',
})
export class AbsenceIndexedDBFacade extends Reactive {

	private readonly absenceIndexedDBCollectionManager = inject(AbsenceIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.serviceIndexedDBCollectionManager.context.database;
	#source!: AbsenceIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			console.log('AbsenceIndexedDBFacade', {tenantId});
			this.#source = this.absenceIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
