import {inject, Injectable} from "@angular/core";
import {Reactive} from "@utility/cdk/reactive";
import {TENANT_ID} from "@src/token";
import {filter} from "rxjs";
import {is} from "../../../../../../core/shared/checker";
import {MemberIndexedDBCollectionManager} from "@member/infrastructure/manager/member.indexedDB.collection.manager";
import {MemberIndexedDBCollection} from "@member/infrastructure/collection/indexedDB/member.indexedDB.collection";

@Injectable({
	providedIn: 'root',
})
export class MemberIndexedDBFacade extends Reactive {

	private readonly memberIndexedDBCollectionManager = inject(MemberIndexedDBCollectionManager);
	private readonly tenantId$ = inject(TENANT_ID);

	// public readonly source = this.serviceIndexedDBCollectionManager.context.database;
	#source!: MemberIndexedDBCollection;

	public constructor() {
		super();
		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {
			this.#source = this.memberIndexedDBCollectionManager.context.database;
		});
	}

	public get source() {
		return this.#source;
	}

}
