import {Types} from "@core/shared/types";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {OrderDirEnum} from "@core/shared/enum";
import IBaseItem from "@core/shared/interface/i.base-item";
import {BehaviorSubject} from "rxjs";

interface SyncState {
	page: number;
	// isPaused: boolean;
}

export interface ISyncManger {

	readonly moduleName: string;

	pause(): void;

	resume(): Promise<void>;

	sync(options: Types.StandardQueryParams): Promise<void>;
}

export abstract class BaseSyncManager<DTO, ENTITY extends IBaseItem<string, DTO>> implements ISyncManger {

	protected abstract readonly repository: BaseRepository<ENTITY>;
	protected abstract readonly apiDataProvider: DataProvider<DTO>;

	protected abstract toEntity(dto: DTO): ENTITY;

	private syncState: SyncState | null = this.loadSyncState();

	public static register = new Map<string, ISyncManger>();
	public static isSyncing$ = new BehaviorSubject<boolean>(false);
	public static isPaused$ = new BehaviorSubject<boolean>(false);

	protected constructor(
		public readonly moduleName: string,
	) {
		if (!this.moduleName) throw new Error('moduleName is required');
		BaseSyncManager.register.set(this.moduleName, this);
	}

	public pause(): void {
		if (this.syncState) {
			// this.syncState.isPaused = true;
			this.saveSyncState();
		}
	}

	public async resume(): Promise<void> {
		if (this.syncState) {
			// this.syncState.isPaused = false;
			this.saveSyncState();
			await this.sync({
				page: this.syncState.page,
				pageSize: 500,
				orderDir: OrderDirEnum.DESC,
				orderBy: 'updatedAt'
			});
		}
	}

	public async sync(options: Types.StandardQueryParams): Promise<void> {
		this.syncState = {
			page: options.page,
			// isPaused: false
		};
		this.saveSyncState();

		while (!BaseSyncManager.isPaused$.value) {
			console.log('----- PAGE ------', options.page);
			const remoteData = await this.apiDataProvider.findAsync(options);
			for (const item of remoteData.items) {
				// const item = await this.repository.findAsync({_id: item._id});
				// const mergedItem = this.resolveConflict(localItem, item);
				const entity = this.toEntity(item);
				// TODO: Delete ts-expect-error and set interface for item
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				entity.syncedAt = new Date().toISOString();
				await this.repository.updateAsync(entity);
			}

			options.page++;
			this.syncState.page = options.page;
			this.saveSyncState();

			if (remoteData.items.length < options.pageSize) break;
		}

		await this.checkLocalChanges();

	}

	private async checkLocalChanges(): Promise<void> {
		const localChanges = await this.repository.findAsync({syncedAt: ''});
		for (const item of localChanges.items) {
			await this.apiDataProvider.updateAsync(item.toDTO());
			// TODO: Delete ts-expect-error and set interface for item
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			item.syncedAt = new Date().toISOString();
			await this.repository.updateAsync(item);
		}
	}

	private resolveConflict(localItem: any, remoteItem: any): any {
		if (!localItem) return remoteItem;
		return new Date(localItem.updatedAt) > new Date(remoteItem.updatedAt) ? localItem : remoteItem;
	}

	private saveSyncState(): void {
		localStorage.setItem('syncState', JSON.stringify(this.syncState));
	}

	private loadSyncState(): SyncState | null {
		const state = localStorage.getItem('syncState');
		return state ? JSON.parse(state) : null;
	}

	public static getSyncManager(moduleName: string): ISyncManger {
		const manager = this.register.get(moduleName);
		if (!manager) throw new Error(`SyncManager not found for ${moduleName}`);
		return manager;
	}

	public static async syncAll(): Promise<void> {
		console.log('Syncing all');
		this.isSyncing$.next(true);
		for (const manager of this.register.values()) {
			console.log(`Syncing ${manager.moduleName}`);
			await manager.sync({
				page: 1,
				pageSize: 500,
				orderDir: OrderDirEnum.DESC,
				orderBy: 'updatedAt'
			});
		}
		this.isSyncing$.next(false);
	}

	public static async pauseAll(): Promise<void> {
		this.isPaused$.next(true);
	}

	public static async resumeAll(): Promise<void> {
		this.isPaused$.next(false);
		this.isSyncing$.next(true);
		for (const manager of this.register.values()) {
			await manager.resume();
		}
		this.isSyncing$.next(false);
	}
}
