import {BehaviorSubject} from "rxjs";
import {AsyncQueue} from "@core/shared/async-queue";
import {ISyncManger, ISyncState, SyncStates} from "@core/system/infrastructure/sync-manager/i.sync-state";

class _SyncManager {

	/**
	 * A map that registers all sync managers by module name.
	 * @type {Map<string, ISyncManger>}
	 */
	public readonly register: Map<string, ISyncManger> = new Map<string, ISyncManger>();

	/**
	 * A readonly `BehaviorSubject` that indicates whether synchronization is in progress.
	 * @type {BehaviorSubject<number>}
	 */
	public readonly isSyncing$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private isSyncingCounter: number = 0;
	private readonly isSyncingAsyncQueue = new AsyncQueue();

	/**
	 * A readonly `BehaviorSubject` that indicates whether synchronization is paused.
	 * @type {BehaviorSubject<boolean>}
	 */
	public readonly isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public async incrementSyncing() {
		const task = new Promise<void>((resolve) => {
			this.isSyncingCounter++;
			this.isSyncing$.next(this.isSyncingCounter);
			resolve();
		});
		await this.isSyncingAsyncQueue.enqueue(() => task);
	}

	public async decrementSyncing() {
		const task = new Promise<void>((resolve) => {
			this.isSyncingCounter--;
			this.isSyncing$.next(this.isSyncingCounter);
			resolve();
		});
		await this.isSyncingAsyncQueue.enqueue(() => task);
	}

	/**
	 * Retrieves the sync manager for the specified module.
	 * @param {string} moduleName - The name of the module.
	 * @returns {ISyncManger} The sync manager.
	 * @throws {Error} If the sync manager is not found.
	 */
	public getSyncManager(moduleName: string): ISyncManger {
		const manager = this.register.get(moduleName);
		if (!manager) throw new Error(`SyncManager not found for ${moduleName}`);
		return manager;
	}

	/**
	 * Synchronizes all registered sync managers.
	 * @returns {Promise<void>}
	 */
	public async syncAll(): Promise<void> {
		this.isPaused$.next(false);
		if (this.isSyncing$.value) {
			return;
		}
		await this.incrementSyncing();
		if (!this.isPaused$.value) await this.pullAll();
		if (!this.isPaused$.value) await this.pushAll();
		await this.decrementSyncing();
	}

	public async pushAll(): Promise<void> {
		this.isPaused$.next(false);
		const pushPromises = Array.from(this.register.values()).map(async (syncManager) => {

			await this.incrementSyncing();

			if (syncManager.isSyncing) {
				console.warn(`⚠️ SyncManager for '${syncManager.moduleName}' is already in progress. Skipping duplicate sync operation to prevent conflicts. This may indicate overlapping sync requests or a stuck sync process.`);
				await this.decrementSyncing();
				return;
			}
			if (syncManager.syncState) {
				syncManager.syncState.progress.total = 0;
			}
			await syncManager.initPushData();
			await syncManager.doPush();

			await this.decrementSyncing();

		});
		await Promise.all(pushPromises);
	}

	public async pullAll(): Promise<void> {
		this.isPaused$.next(false);
		const pullPromises = Array.from(this.register.values()).map(async (manager) => {
			await this.incrementSyncing();
			try {
				await manager.initPullData();
				await manager.doPull();
			} catch (error) {
				// TODO: use ngxLogger instead of console.error
				console.error(`SyncManager ${manager.moduleName} pull failed`, error);
			} finally {
				await this.decrementSyncing();
			}
		});
		await Promise.all(pullPromises);
	}

	/**
	 * Pauses all registered sync managers.
	 * @returns {Promise<void>}
	 */
	public async pauseAll(): Promise<void> {
		this.isPaused$.next(true);
	}

	/**
	 * Resumes all registered sync managers.
	 * @returns {Promise<void>}
	 */
	public async resumeAll(): Promise<void> {
		this.isPaused$.next(false);
		await this.incrementSyncing();
		for (const manager of this.register.values()) {
			await manager.resume();
		}
		await this.decrementSyncing();
	}

	/**
	 * Saves the synchronization state for the specified module.
	 * @param moduleName
	 * @param tenant
	 * @param syncState
	 * @private
	 */
	public saveSyncState(moduleName: string, syncState: ISyncState, tenant: string): void {
		const states = this.loadAllSyncStates();
		if (!states[moduleName]) {
			states[moduleName] = {
				tenant: syncState,
			};
		} else {
			states[moduleName][tenant] = syncState;
		}
		localStorage.setItem('syncStates', JSON.stringify(states));
	}

	/**
	 * Clears the synchronization state for the specified module.
	 * @param moduleName
	 * @param tenant
	 * @private
	 */
	public clearSyncState(moduleName: string, tenant: string): void {
		const states = this.loadAllSyncStates();
		if (tenant in states[moduleName]) {
			delete states[moduleName][tenant];
		}
		localStorage.setItem('syncStates', JSON.stringify(states));
	}

	/**
	 * Loads the synchronization state for the specified module.
	 * @param moduleName
	 * @param tenant
	 * @private
	 */
	public loadSyncState(moduleName: string, tenant: string): ISyncState | null {
		const states = this.loadAllSyncStates();
		const moduleState = states[moduleName];
		if (!moduleState) return null;
		return moduleState[tenant] || null;
	}

	/**
	 * Loads all synchronization states from local storage.
	 * @private
	 */
	public loadAllSyncStates(): SyncStates {
		const states = localStorage.getItem('syncStates');
		return states ? JSON.parse(states) : {};
	}


}

export const SyncManager = new _SyncManager();
