import {Injectable, OnDestroy} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IBaseEntity} from "@core/shared/interface/i.base-entity";
import {Reactive} from "@utility/cdk/reactive";
import {CreatingHookContext, Table, UpdatingHookContext} from "dexie";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {AsyncQueue} from "@core/shared/async-queue";

const asyncQueue = new AsyncQueue();

function hookCreate(this: CreatingHookContext<any, any>, primKey: any, obj: IBaseEntity, transaction: any) {


	if (obj.isNew() || obj.isUpdated()) {

		this.onsuccess = (primKey) => {

			const isOnline = window.navigator.onLine;

			console.log('PushChangesSyncManager:hookCreate:onsuccess', {BaseSyncManager, primKey});

			if (isOnline) {
				setTimeout(() => {
					asyncQueue.enqueue(() => {
						return BaseSyncManager.pushAll()
					}).then();
				}, 250);
			}

		};

	}

}

function hookUpdate(this: UpdatingHookContext<any, any>, modifications: any, primKey: any, obj: IBaseEntity, transaction: any) {


	if ((!obj?.syncedAt) || obj.syncedAt < obj.updatedAt) {

		this.onsuccess = (updatedObj) => {

			const isOnline = window.navigator.onLine;

			console.log('PushChangesSyncManager:hookUpdate:onsuccess', {BaseSyncManager, updatedObj});

			if (isOnline) {
				setTimeout(() => {
					asyncQueue.enqueue(() => {
						return BaseSyncManager.pushAll()
					}).then();
				}, 250);
			}

		};

	}

}

@Injectable()
export class BasePushChangesSyncManager<ENTITY extends IBaseEntity> extends Reactive implements OnDestroy {

	private readonly hooksToDestroy = new Map<string, () => void>();

	public constructor(
		public readonly indexedDBDataProvider: IndexedDBDataProvider<ENTITY>,
	) {
		super();
		console.log('PushChangesSyncManager', this.indexedDBDataProvider);
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		table.hook(name, fn);
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
