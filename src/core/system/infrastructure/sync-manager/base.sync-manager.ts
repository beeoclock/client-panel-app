import {Types} from "@core/shared/types";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {OrderDirEnum} from "@core/shared/enum";
import IBaseItem from "@core/shared/interface/i.base-item";
import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
import {Table} from "dexie";

interface ISyncState {
	progress: {
		total: number;
		current: number;
		percentage: number;
	};
	lastStartSync: string;
	lastEndSync: string | null;
}

export interface ISyncManger {
	readonly moduleName: string;

	pause(): void;

	resume(): Promise<void>;

	sync(options: Types.StandardQueryParams): Promise<void>;
}

interface SyncStates {
	[moduleName: string]: ISyncState;
}

/**
 * TODO: Add per tenant sync state!!!!!!!!
 * The `BaseSyncManager` class is an abstract class that provides a framework for synchronizing data between a local repository and a remote data provider.
 * It implements the `ISyncManager` interface and includes methods for pausing, resuming, and synchronizing data.
 * The class maintains the synchronization state and handles conflict resolution between local and remote data.
 *
 * @template DTO - The data transfer object type.
 * @template ENTITY - The entity type that extends `IBaseItem`.
 */
export abstract class BaseSyncManager<DTO extends {
	updatedAt: string;
}, ENTITY extends IBaseItem<string, DTO>> implements ISyncManger {

	/**
	 * The name of the module using the sync manager.
	 * @type {string}
	 */
	public readonly moduleName: string;

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
	private syncState: ISyncState | null = null;

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

	/**
	 * Constructs a new `BaseSyncManager`.
	 * @param {string} moduleName - The name of the module.
	 * @throws {Error} If the module name is not provided.
	 */
	protected constructor(moduleName: string) {
		if (!moduleName) throw new Error('moduleName is required');
		this.moduleName = moduleName;
		BaseSyncManager.register.set(this.moduleName, this);
		this.syncState = BaseSyncManager.loadSyncState(this.moduleName)
	}

	/**
	 * Pauses the synchronization process.
	 */
	public pause(): void {
		this.saveSyncState();
	}

	/**
	 * Resumes the synchronization process and continues from the last saved state.
	 * @returns {Promise<void>}
	 */
	public async resume(): Promise<void> {
		if (this.syncState) {
			this.saveSyncState();
			const firstUpdatedSince = new Date(0).toISOString();
			await this.sync({
				page: 1,
				pageSize: 500,
				orderDir: OrderDirEnum.ASC,
				orderBy: 'updatedAt',
				updatedSince: this.syncState.lastEndSync ?? firstUpdatedSince,
			});
		}
	}

	/**
	 * Synchronizes data based on the provided query parameters.
	 * @param {Types.StandardQueryParams} options - The query parameters.
	 * @returns {Promise<void>}
	 */
	public async sync(options: Types.StandardQueryParams): Promise<void> {

		await this.initPushData();

		let remoteData = await this.apiDataProvider.findAsync(options);

		this.syncState = {
			progress: {
				total: remoteData.totalSize + this.pushData.length,
				current: 0,
				percentage: 0,
			},
			lastStartSync: new Date().toISOString(),
			lastEndSync: null,
		};

		this.saveSyncState();

		while (!BaseSyncManager.isPaused$.value) {

			for (const item of remoteData.items) {

				const entity = this.toEntity(item);

				// @ts-ignore
				entity['syncedAt'] = new Date().toISOString();
				await this.repository.updateAsync(entity);

				this.syncState.progress.current++;
				this.syncState.progress.percentage = (this.syncState.progress.current / this.syncState.progress.total) * 100;
				this.syncState.lastEndSync = item.updatedAt;

			}

			options.page++;
			this.saveSyncState();

			if (remoteData.items.length < options.pageSize) {
				this.syncState.lastEndSync = new Date().toISOString();
				this.saveSyncState();
				break;
			}

			remoteData = await this.apiDataProvider.findAsync(options);

		}

		await this.checkLocalChanges();
	}

	private async initPushData() {
		if ('db$' in this.repository.dataProvider) {

			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY>> };
			const table = await firstValueFrom(db$);
			const localChanges = await table.filter((item) => {
				if ('syncedAt' in item && 'updatedAt' in item) {
					return new Date(item.syncedAt) < new Date(item.updatedAt);
				}
				return !item['syncedAt'];

			}).toArray();
			this.pushData = localChanges;

		}

	}

	/**
	 * Checks for local changes that need to be synchronized with the remote data provider.
	 * @private
	 * @returns {Promise<void>}
	 */
	private async checkLocalChanges(): Promise<void> {

		if (!this.pushData.length) return;

		if (!this.syncState) {
			throw new Error('Sync state is not initialized');
		}

		for (const item of this.pushData) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			let entity = this.toEntity(item);
			const dto = entity.toDTO();

			let serverHasItem = await this.apiDataProvider.findByIdAsync(entity._id);

			if (serverHasItem) {
				// Update case
				await this.apiDataProvider.updateAsync(dto);
			} else {
				// Create case
				await this.apiDataProvider.createAsync(dto);
				serverHasItem = await this.apiDataProvider.findByIdAsync(entity._id);
			}

			if (!serverHasItem) {
				throw new Error('Item not found on server');
			}

			entity = this.toEntity(serverHasItem);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			entity['syncedAt'] = new Date().toISOString();
			await this.repository.updateAsync(entity);
			this.syncState.progress.current++;
			this.syncState.progress.percentage = (this.syncState.progress.current / this.syncState.progress.total) * 100;
			this.saveSyncState();
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
			BaseSyncManager.saveSyncState(this.moduleName, this.syncState);
		} else {
			BaseSyncManager.clearSyncState(this.moduleName);
		}
	}

	/**
	 * Loads the synchronization state from local storage.
	 * @private
	 * @returns {ISyncState | null} The loaded synchronization state.
	 */
	private loadSyncState(): ISyncState | null {
		const state = localStorage.getItem('syncState');
		return state ? JSON.parse(state) : null;
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
		// Take updatedSunc from the last sync state
		for (const manager of this.register.values()) {
			const syncState = this.loadSyncState(manager.moduleName);
			await manager.sync({
				page: 1,
				pageSize: 500,
				orderDir: OrderDirEnum.ASC,
				orderBy: 'updatedAt',
				updatedSince: syncState?.lastEndSync ?? new Date(0).toISOString(),
			});
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
	 * @param syncState
	 * @private
	 */
	private static saveSyncState(moduleName: string, syncState: ISyncState): void {
		const states = this.loadAllSyncStates();
		states[moduleName] = syncState;
		localStorage.setItem('syncStates', JSON.stringify(states));
	}

	/**
	 * Clears the synchronization state for the specified module.
	 * @param moduleName
	 * @private
	 */
	private static clearSyncState(moduleName: string): void {
		const states = this.loadAllSyncStates();
		delete states[moduleName];
		localStorage.setItem('syncStates', JSON.stringify(states));
	}

	/**
	 * Loads the synchronization state for the specified module.
	 * @param moduleName
	 * @private
	 */
	private static loadSyncState(moduleName: string): ISyncState | null {
		const states = this.loadAllSyncStates();
		return states[moduleName] || null;
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
