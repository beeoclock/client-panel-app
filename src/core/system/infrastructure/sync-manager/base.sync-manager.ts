import {Types} from "@core/shared/types";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {Table} from "dexie";
import {IBaseDTO} from "@core/shared/interface/i-base-entity.raw";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {HttpErrorResponse} from "@angular/common/http";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {AsyncQueue} from "@core/shared/async-queue";

interface ISyncState {
	options: Types.StandardQueryParams;
	progress: {
		total: number;
		current: number;
		percentage: number;
	};
	lastStartSync: string;
	lastSuccessSyncItemAt: string | null;
}

export interface ISyncManger {
	readonly moduleName: string;
	readonly tenantId: string;

	isSyncing: number;

	resume(): Promise<void>;

	sync(): Promise<void>;

	syncState: ISyncState | null;

	initSyncState(): void;

	initPullData(): Promise<boolean>;

	initPushData(): Promise<void>;

	doPull(): Promise<void>;

	doPush(): Promise<void>;

	setTenantId(tenantId: string): void;
}

interface SyncStates {
	[moduleName: string]: {
		[tenant: string]: ISyncState;
	};
}

/**
 * The `BaseSyncManager` class is an abstract class that provides a framework for synchronizing data between a local repository and a remote data provider.
 * It implements the `ISyncManager` interface and includes methods for pausing, resuming, and synchronizing data.
 * The class maintains the synchronization state and handles conflict resolution between local and remote data.
 *
 * @template DTO - The data transfer object type.
 * @template ENTITY - The entity type that extends `IBaseItem`.
 */
export abstract class BaseSyncManager<DTO extends IBaseDTO<string>, ENTITY extends ABaseEntity<string, DTO>> implements ISyncManger {

	/**
	 * The name of the module using the sync manager.
	 * @type {string}
	 */
	public readonly moduleName: string;

	/**
	 * An abstract property representing the tenant ID.
	 * @protected
	 * @type {string}
	 */
	#tenantId: string | undefined;

	#isSyncing: number = 0;

	/**
	 * An abstract property representing the local repository.
	 * @type {BaseRepository<ENTITY>}
	 */
	protected abstract readonly repository: BaseRepository<ENTITY>;

	/**
	 * An abstract property representing the remote data provider.
	 * @type {DataProvider<DTO>}
	 */
	protected abstract readonly apiDataProvider: DataProvider<DTO>;

	/**
	 * An array of local changes that need to be synchronized with the remote data provider.
	 * @private
	 */
	private pushData: Array<ENTITY> = [];
	private pullData: ResponseListType<DTO> = {items: [], totalSize: 0};

	/**
	 * Converts a DTO to an entity.
	 * @param {DTO} dto - The data transfer object.
	 * @returns {ENTITY} The entity.
	 */
	protected abstract toEntity(dto: DTO): ENTITY;

	/**
	 * The current synchronization state.
	 * @type {ISyncState | null}
	 * @private
	 */
	#syncState: ISyncState | null = null;

	/**
	 * A static map that registers all sync managers by module name.
	 * @type {Map<string, ISyncManger>}
	 */
	public static register: Map<string, ISyncManger> = new Map<string, ISyncManger>();

	/**
	 * A static `BehaviorSubject` that indicates whether synchronization is in progress.
	 * @type {BehaviorSubject<number>}
	 */
	public static isSyncing$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private static isSyncingCounter: number = 0;
	private static isSyncingAsyncQueue = new AsyncQueue();

	/**
	 * A static `BehaviorSubject` that indicates whether synchronization is paused.
	 * @type {BehaviorSubject<boolean>}
	 */
	public static isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	public get syncState(): ISyncState | null {
		return this.#syncState;
	}

	public set syncState(value: ISyncState | null) {
		this.#syncState = value;
	}

	/**
	 * Constructs a new `BaseSyncManager`.
	 * @param {string} moduleName - The name of the module.
	 * @throws {Error} If the module name is not provided.
	 */
	protected constructor(
		moduleName: string,
	) {
		if (!moduleName) throw new Error('moduleName is required');
		this.moduleName = moduleName;
		BaseSyncManager.register.set(this.moduleName, this);
	}

	public setTenantId(tenantId: string) {
		this.#tenantId = tenantId;
		this.#syncState = BaseSyncManager.loadSyncState(this.moduleName, this.tenantId);
		// Initialize the sync state
		this.initSyncState();
	}

	public get tenantId(): string {
		if (!this.#tenantId) throw new Error('Tenant ID is not set');
		return this.#tenantId;
	}

	public get isSyncing(): number {
		return this.#isSyncing;
	}

	public static async incrementSyncing() {
		const task = new Promise<void>((resolve) => {
			this.isSyncingCounter++;
			this.isSyncing$.next(this.isSyncingCounter);
			resolve();
		});
		await this.isSyncingAsyncQueue.enqueue(() => task);
	}

	public static async decrementSyncing() {
		const task = new Promise<void>((resolve) => {
			this.isSyncingCounter--;
			this.isSyncing$.next(this.isSyncingCounter);
			resolve();
		});
		await this.isSyncingAsyncQueue.enqueue(() => task);
	}

	/**
	 * Resumes the synchronization process and continues from the last saved state.
	 * @returns {Promise<void>}
	 */
	public async resume(): Promise<void> {
		if (this.#syncState) {
			await this.sync();
		}
	}

	public initSyncState() {

		if (!this.#syncState) {

			this.#syncState = {
				options: {
					page: 1,
					pageSize: 500,
					/**
					 * OrderDirEnum.ASC - because we want to sync from the oldest to the newest, so if user will do refresh page (F5)
					 * then we can sync from the last sync
					 */
					orderDir: OrderDirEnum.DESC,
					orderBy: OrderByEnum.CREATED_AT,
					updatedSince: new Date(0).toISOString(),
				},
				progress: {
					total: this.pullData.totalSize + this.pushData.length,
					current: 0,
					percentage: 0,
				},
				lastStartSync: new Date().toISOString(),
				lastSuccessSyncItemAt: null,
			}

			this.saveSyncState();

		}

	}

	/**
	 * Synchronizes data based on the provided query parameters.
	 * @returns {Promise<void>}
	 */
	public async sync(): Promise<void> {

		this.#isSyncing += 1;

		if (this.#syncState) {
			this.#syncState.progress.total = 0;
		}

		// Prepare pull and push data
		await this.initPushData();
		const pullInitialized = await this.initPullData();

		// Do sync
		if (pullInitialized) await this.doPull();
		await this.doPush();

		this.#isSyncing -= 1;
	}

	/**
	 * Initializes the pull data from the remote data provider.
	 * @param firstPage
	 * @param isContinuation
	 */
	public async initPullData(firstPage: boolean = true, isContinuation: boolean = false) {

		if (!this.#syncState) {
			throw new Error('Sync state is not initialized');
		}

		try {
			const {options, lastSuccessSyncItemAt} = this.#syncState;
			this.pullData = await this.apiDataProvider.findAsync({
				...options,
				// If user did F5 (refresh page) during sync, then we can sync from the last sync
				updatedSince: isContinuation ? options.updatedSince : (lastSuccessSyncItemAt ?? options.updatedSince),
			});

			if (firstPage) {
				if (this.#syncState) {
					this.#syncState.progress.total += this.pullData.totalSize;
					this.saveSyncState();
				}
			}

			return true;

		} catch (error) {

			console.error('Error while pulling data', error);
			return false;

		}

	}

	public async initPushData() {
		if ('db$' in this.repository.getDataProvider()) {

			const {db$} = this.repository.getDataProvider() as unknown as { db$: Observable<Table<ENTITY>> };
			const table = await firstValueFrom(db$);
			const localChanges = await table.filter((item) => {

				if ('syncedAt' in item && 'updatedAt' in item && item.syncedAt) {

					return new Date(item.syncedAt) < new Date(item.updatedAt);

				}

				return !item['syncedAt'];

			}).toArray();
			this.pushData = localChanges;
			if (this.#syncState) {
				this.#syncState.progress.total += this.pushData.length;
				this.saveSyncState();
			}

		}

	}

	/**
	 * Synchronizes data from the remote data provider to the local repository.
	 */
	public async doPull() {

		if (!this.#syncState) {
			throw new Error('Sync state is not initialized');
		}

		this.#isSyncing += 1;

		this.#syncState.lastStartSync = new Date().toISOString();
		this.saveSyncState();

		const lastPage = Math.ceil(this.pullData.totalSize / this.#syncState.options.pageSize);

		while (!BaseSyncManager.isPaused$.value) {

			for (const item of this.pullData.items) {

				const entity = this.toEntity(item);
				entity.initSyncedAt();

				/**
				 * Get entity from local database to check if we have local changes
				 */
				const entityRaw = await this.repository.findByIdAsync(item._id);

				if (entityRaw) {

					const localEntity = this.toEntity(entityRaw as unknown as DTO);
					const resolvedEntity = this.resolveConflict(localEntity, entity);
					await this.putEntity(resolvedEntity);

				} else {

					await this.putEntity(entity);

				}

				this.#syncState.progress.current++;
				this.#syncState.progress.percentage = (this.#syncState.progress.current / this.#syncState.progress.total) * 100;
				if (this.#syncState.progress.percentage >= 100) {
					this.#syncState.progress.percentage = 99;
				}
				this.#syncState.lastSuccessSyncItemAt = item.updatedAt;

			}

			this.#syncState.options.page++;
			this.saveSyncState();

			if (lastPage < this.#syncState.options.page) {
				this.#syncState.options.page = 1;
				this.#syncState.options.updatedSince = new Date().toISOString();
				this.#syncState.lastSuccessSyncItemAt = null;
				this.saveSyncState();
				break;
			}

			const pullInitialized = await this.initPullData(false, true);
			if (!pullInitialized) break;

		}

		this.#isSyncing -= 1;

	}

	/**
	 * Checks for local changes that need to be synchronized with the remote data provider.
	 * @private
	 * @returns {Promise<void>}
	 */
	public async doPush(): Promise<void> {

		if (!this.pushData.length) return;

		if (!this.syncState) {
			throw new Error('Sync state is not initialized');
		}

		this.#isSyncing += 1;

		do {

			const item = this.pushData.shift();

			if (!item) {
				break;
			}

			try {

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				let entity = this.toEntity(item);
				const dto = entity.toDTO();

				if (entity.isNew()) {

					// Create case
					await this.apiDataProvider.createAsync(dto);

					const serverHasItem = await this.apiDataProvider.findByIdAsync(entity._id);

					if (!serverHasItem) {
						throw new Error('Item not found on server');
					}

					entity = this.toEntity(serverHasItem);
					/**
					 * We need to set syncedAt to updatedAt because we want to know that this object is already on the server
					 * And I don't know why but on the Windows OS we have problem with every browser to set syncedAt
					 * Effect on windows browsers without as argument updatedAt we will have something like this:
					 * syncedAt: "2021-09-14T08:00:00.000Z"
					 * updatedAt: "2021-09-14T08:00:00.001Z" <- updated has 1ms more than syncedAt
					 */
					entity.initSyncedAt(entity.updatedAt);

					await this.putEntity(entity);

				} else {

					if (entity.isUpdated()) {

						// Update case
						await this.apiDataProvider.updateAsync(dto);

						const serverHasItem = await this.apiDataProvider.findByIdAsync(entity._id);

						if (!serverHasItem) {
							throw new Error('Item not found on server');
						}

						entity = this.toEntity(serverHasItem);
						entity.initSyncedAt(entity.updatedAt);

						await this.putEntity(entity);

					}

				}

				this.syncState.progress.current++;
				this.syncState.progress.percentage = (this.syncState.progress.current / this.syncState.progress.total) * 100;
				if (this.syncState.progress.percentage >= 100) {
					this.syncState.progress.percentage = 99;
				}
				this.saveSyncState();

			} catch (error) {
				if (error instanceof HttpErrorResponse) {

					if (error.status === 400) {

						const serverHasItem = await this.apiDataProvider.findByIdAsync(item._id);

						if (!serverHasItem) {
							throw new Error('Item not found on server');
						}

						const entity = this.toEntity(serverHasItem);
						entity.initSyncedAt();

						await this.putEntity(entity);

					} else {

						console.error('Error while pushing data', error);

					}

				} else {

					console.error('Error while pushing data', error);

				}
			}

		} while (this.pushData.length && !BaseSyncManager.isPaused$.value);

		this.#isSyncing -= 1;

	}

	private async putEntity(entity: ENTITY) {
		if ('db$' in this.repository.getDataProvider()) {
			const {db$} = this.repository.getDataProvider() as unknown as { db$: Observable<Table<ENTITY>> };
			const table = await firstValueFrom(db$);
			// Use buildPut instead of put to avoid conflicts, because this.repository.updateSync use db.table.put and it call hooks
			await table.put(entity);
		}
	}

	/**
	 * Resolves conflicts between local and remote items based on the `updatedAt` timestamp.
	 * @param {any} localItem - The local item.
	 * @param {any} remoteItem - The remote item.
	 * @returns {any} The resolved item.
	 * @private
	 */
	private resolveConflict(localItem: ENTITY, remoteItem: ENTITY): ENTITY {
		if (!localItem) return remoteItem;
		return new Date(localItem.updatedAt) > new Date(remoteItem.updatedAt) ? localItem : remoteItem;
	}

	/**
	 * Saves the current synchronization state to local storage.
	 * @private
	 */
	private saveSyncState(): void {
		if (this.syncState) {
			BaseSyncManager.saveSyncState(this.moduleName, this.syncState, this.tenantId);
		} else {
			BaseSyncManager.clearSyncState(this.moduleName, this.tenantId);
		}
	}

	/**
	 * Retrieves the sync manager for the specified module.
	 * @param {string} moduleName - The name of the module.
	 * @returns {ISyncManger} The sync manager.
	 * @throws {Error} If the sync manager is not found.
	 */
	public static getSyncManager(moduleName: string): ISyncManger {
		const manager = this.register.get(moduleName);
		if (!manager) throw new Error(`SyncManager not found for ${moduleName}`);
		return manager;
	}

	/**
	 * Synchronizes all registered sync managers.
	 * @returns {Promise<void>}
	 */
	public static async syncAll(): Promise<void> {
		this.isPaused$.next(false);
		if (this.isSyncing$.value) {
			return;
		}
		await this.incrementSyncing();
		if (!this.isPaused$.value) await this.pullAll();
		if (!this.isPaused$.value) await this.pushAll();
		await this.decrementSyncing();
	}

	public static async pushAll(): Promise<void> {
		this.isPaused$.next(false);
		const pushPromises = Array.from(this.register.values()).map(async (syncManager) => {

			await this.incrementSyncing();
			if (syncManager.isSyncing) {
				console.warn(`SyncManager ${syncManager.moduleName} is already syncing`);
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

	public static async pullAll(): Promise<void> {
		this.isPaused$.next(false);
		const pullPromises = Array.from(this.register.values()).map(async (manager) => {
			await this.incrementSyncing();
			try {
				await manager.initPullData();
				await manager.doPull();
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
	public static async pauseAll(): Promise<void> {
		this.isPaused$.next(true);
	}

	/**
	 * Resumes all registered sync managers.
	 * @returns {Promise<void>}
	 */
	public static async resumeAll(): Promise<void> {
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
	private static saveSyncState(moduleName: string, syncState: ISyncState, tenant: string): void {
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
	private static clearSyncState(moduleName: string, tenant: string): void {
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
	private static loadSyncState(moduleName: string, tenant: string): ISyncState | null {
		const states = this.loadAllSyncStates();
		const moduleState = states[moduleName];
		if (!moduleState) return null;
		return moduleState[tenant] || null;
	}

	/**
	 * Loads all synchronization states from local storage.
	 * @private
	 */
	private static loadAllSyncStates(): SyncStates {
		const states = localStorage.getItem('syncStates');
		return states ? JSON.parse(states) : {};
	}

}
