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

	isSyncing: boolean;

	resume(): Promise<void>;

	sync(): Promise<void>;

	syncState: ISyncState | null;

	initSyncState(): void;

	initPullData(): Promise<void>;

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

	#isSyncing: boolean = false;

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
	 * @type {BehaviorSubject<boolean>}
	 */
	public static isSyncing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

	public get isSyncing(): boolean {
		return this.#isSyncing;
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
					orderDir: OrderDirEnum.ASC,
					orderBy: OrderByEnum.UPDATED_AT,
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

		this.#isSyncing = true;

		if (this.#syncState) {
			this.#syncState.progress.total = 0;
		}

		// Prepare pull and push data
		await this.initPushData();
		await this.initPullData();

		// Do sync
		await this.doPull();
		await this.doPush();

		this.#isSyncing = false;
	}

	public async initPullData(firstPage: boolean = true, isContinuation: boolean = false) {

		if (!this.#syncState) {
			throw new Error('Sync state is not initialized');
		}

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

	}

	public async initPushData() {
		if ('db$' in this.repository.dataProvider) {

			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY>> };
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

		this.#isSyncing = true;

		this.#syncState.lastStartSync = new Date().toISOString();
		this.saveSyncState();

		const lastPage = Math.ceil(this.pullData.totalSize / this.#syncState.options.pageSize);

		while (!BaseSyncManager.isPaused$.value) {

			for (const item of this.pullData.items) {

				const entity = this.toEntity(item);
				entity.initSyncedAt();

				await this.putEntity(entity);

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

			await this.initPullData(false, true);

		}

		this.#isSyncing = false;

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

		this.#isSyncing = true;

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

				// Check if the entity is already on the server, we take data from local and if object has syncedAt then we know that object is already on the server
				const entityFromLocal = await this.repository.findByIdAsync(entity._id);

				if (!entityFromLocal || entityFromLocal?.isNew?.() || entityFromLocal?.isUpdated?.()) {
					console.log('Entity is new or updated', {entityFromLocal, entity});
				}

				if (entity.isNew()) {

					// Create case
					await this.apiDataProvider.createAsync(dto);

					const serverHasItem = await this.apiDataProvider.findByIdAsync(entity._id);

					if (!serverHasItem) {
						throw new Error('Item not found on server');
					}

					entity = this.toEntity(serverHasItem);
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

		this.#isSyncing = false;

	}

	private async putEntity(entity: ENTITY) {
		if ('db$' in this.repository.dataProvider) {
			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY>> };
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
		this.isSyncing$.next(true);
		// Take updatedSince from the last sync state
		for (const manager of this.register.values()) {
			await manager.sync();
		}
		this.isSyncing$.next(false);
	}

	public static async pushAll(): Promise<void> {
		this.isSyncing$.next(true);
		for (const syncManager of this.register.values()) {
			if (syncManager.isSyncing) {
				continue;
			}
			if (syncManager.syncState) {
				syncManager.syncState.progress.total = 0;
			}
			await syncManager.initPushData();
			await syncManager.doPush();
		}
		this.isSyncing$.next(false);
	}

	public static async pullAll(): Promise<void> {
		this.isSyncing$.next(true);
		for (const manager of this.register.values()) {
			await manager.initPullData();
			await manager.doPull();
		}
		this.isSyncing$.next(false);
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
		this.isSyncing$.next(true);
		for (const manager of this.register.values()) {
			await manager.resume();
		}
		this.isSyncing$.next(false);
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
				[tenant]: syncState,
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
