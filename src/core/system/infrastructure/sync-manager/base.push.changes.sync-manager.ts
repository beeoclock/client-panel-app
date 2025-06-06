import {Injectable, OnDestroy} from "@angular/core";
import {IndexedDBDataProvider} from "@core/system/infrastructure/data-provider/indexedDB.data-provider";
import {IBaseEntityRaw} from "@core/shared/interface/i-base-entity.raw";
import {Reactive} from "@core/cdk/reactive";
import {CreatingHookContext, Table, UpdatingHookContext} from "dexie";
import {BaseSyncManager} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {AsyncQueue} from "@core/shared/async-queue";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";

const asyncQueue = new AsyncQueue();

function hookCreate(this: CreatingHookContext<any, any>, primKey: any, obj: ABaseEntity, transaction: any) {

	if (obj.isNew()) {

		this.onsuccess = (primKey) => {

			const isOnline = window.navigator.onLine;

			if (isOnline) {
				setTimeout(() => {
					asyncQueue.enqueue(() => {
						return BaseSyncManager.syncAll()
					}).then();
				}, 0);
			}

		};

	}

}

function hookUpdate(this: UpdatingHookContext<any, any>, modifications: any, primKey: any, obj: IBaseEntityRaw<string>, transaction: any) {

	const objIsUpdated = obj.syncedAt && obj.updatedAt > obj.syncedAt;

	const modificationIsUpdated = modifications.updatedAt && modifications.syncedAt && modifications.updatedAt > modifications.syncedAt;

	const objModificationIsUpdated = modifications.updatedAt && obj.syncedAt && modifications.updatedAt > obj.syncedAt;

	const isUpdated = objIsUpdated || modificationIsUpdated || objModificationIsUpdated;

	if (isUpdated) {

		this.onsuccess = (updatedObj) => {

			const isOnline = window.navigator.onLine;

			if (isOnline) {
				setTimeout(() => {
					asyncQueue.enqueue(() => {
						return BaseSyncManager.syncAll()
					}).then();
				}, 0);
			}

		};

	}

}

@Injectable()
export class BasePushChangesSyncManager<ENTITY extends ABaseEntity> extends Reactive implements OnDestroy {

	private readonly hooksToDestroy = new Map<string, () => void>();

	public constructor(
		public readonly indexedDBDataProvider: IndexedDBDataProvider<ENTITY>,
	) {
		super();
		this.indexedDBDataProvider.db$.pipe(
			this.takeUntil(),
		).subscribe((table) => {

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
