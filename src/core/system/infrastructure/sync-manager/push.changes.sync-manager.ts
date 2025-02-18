import {Injectable, OnDestroy} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IBaseEntity} from "@core/shared/interface/i.base-entity";
import {Reactive} from "@utility/cdk/reactive";
import {CreatingHookContext, Table, UpdatingHookContext} from "dexie";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";

function hookCreate(this: CreatingHookContext<any, any>, primKey: any, obj: any, transaction: any) {

	console.log({primKey, obj, transaction});

	this.onsuccess = (primKey) => {

		const isOnline = window.navigator.onLine;

		console.log({BaseSyncManager, primKey});

		if (isOnline) {
			setTimeout(() => {
				BaseSyncManager.pushAll().then()
			}, 250);
		}

	};

}

function hookUpdate(this: UpdatingHookContext<any, any>, modifications: any, primKey: any, obj: any, transaction: any) {

	console.log({modifications, primKey, obj, transaction});


	this.onsuccess = (updatedObj) => {

		const isOnline = window.navigator.onLine;

		console.log({BaseSyncManager, updatedObj});

		if (isOnline) {
			setTimeout(() => {
				BaseSyncManager.pushAll().then()
			}, 250);
		}

	};

}

@Injectable()
export class PushChangesSyncManager<ENTITY extends IBaseEntity> extends Reactive implements OnDestroy {

	private readonly hooksToDestroy = new Map<string, () => void>();

	public constructor(
		public readonly indexedDBDataProvider: IndexedDBDataProvider<ENTITY>,
	) {
		super();
		console.log('PushChangesSyncManager');
		this.indexedDBDataProvider.db$.pipe(
			this.takeUntil(),
		).subscribe((table) => {
			console.log('PushChangesSyncManager:table', {table});

			this.destroyHooks();

			this.initHook('creating', hookCreate, table);
			this.initHook('updating', hookUpdate, table);

		});
	}

	private initHook(name: 'creating' | 'updating' | 'deleting', fn: any, table: Table<ENTITY, any, ENTITY>) {
		this.hooksToDestroy.set(name, () => {
			table.hook(name).unsubscribe(fn);
		});
		switch (name) {
			case 'creating':
				table.hook(name, fn);
				break;
			case 'updating':
				table.hook(name, fn);
				break;
		}
	}

	public override ngOnDestroy() {
		super.ngOnDestroy();
		this.destroyHooks();
	}

	private destroyHooks() {
		this.hooksToDestroy.forEach((unsubscribe) => {
			unsubscribe();
		});
	}


}
