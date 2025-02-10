import {BaseItem, Collection, EventEmitter} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {BehaviorSubject, delay, filter, firstValueFrom} from "rxjs";
import {TokensHttpContext} from "@src/tokens.http-context";
import {LastSynchronizationInService} from "@utility/cdk/last-synchronization-in.service";
import {TENANT_ID} from "@src/token";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";
import {environment} from "@environment/environment";

const paginationEmitter = new EventEmitter();

const errorEmitter = new EventEmitter();
errorEmitter.on('error', (message: unknown) => {
	console.log('errorEmitter:', {message})
	// display validation errors to the user
});

const getSyncMangerInstance = (httpClient: HttpClient, tenantId: string) => new SyncManager({
	// autostart: false,
	id: tenantId,
	reactivity: angularReactivityAdapter,
	persistenceAdapter: createIndexedDBAdapter,
	onError: (error) => {
		console.log('SignalDB:onError', {error})
	},
	registerRemoteChange: (collectionOptions, onChange) => {
		paginationEmitter.on(collectionOptions.name, async (data: {
			endpoint: {
				get: string
			},
			totalSize: number,
			updatedSince: string,
		}) => {

			console.log('SignalDB:registerRemoteChange', {data})

			if (!data) {
				return;
			}

			paginationEmitter.emit(`${collectionOptions.name}-start`, data);

			const {endpoint, totalSize, updatedSince} = data;

			const pages = Math.ceil(totalSize / +environment.config.syncManager.pull.pageSize);

			for (let page = 2; page <= pages; page++) {
				const request$ = httpClient.get<ResponseListType<BaseItem>>(endpoint.get, {
					params: {
						orderBy: OrderByEnum.UPDATED_AT,
						orderDir: OrderDirEnum.DESC,
						page,
						pageSize: environment.config.syncManager.pull.pageSize,
						updatedSince
					}
				}).pipe(delay(environment.config.syncManager.pull.delay));
				const response = await firstValueFrom(request$);
				await onChange({
					changes: {
						added: response.items.map(collectionOptions.create) as unknown as BaseItem[],
						modified: [],
						removed: []
					}
				});
			}

			paginationEmitter.emit(`${collectionOptions.name}-finish`, data);

		});
	},
	pull: async (something, pullParameters) => {
		const {endpoint, create, single = false} = something;

		if (single) {
			const request$ = httpClient.get(endpoint.get);
			const response = await firstValueFrom(request$);
			const item = create(response) as never;
			return {items: [item]};
		}

		const {lastFinishedSyncStart} = pullParameters;

		const updatedSince = lastFinishedSyncStart ? new Date(lastFinishedSyncStart).toISOString() : new Date(0).toISOString();

		const request$ = httpClient.get<ResponseListType<BaseItem>>(endpoint.get, {
			params: {
				orderBy: OrderByEnum.UPDATED_AT,
				orderDir: OrderDirEnum.DESC,
				page: environment.config.syncManager.pull.page,
				pageSize: environment.config.syncManager.pull.pageSize,
				updatedSince
			}
		});
		const response = await firstValueFrom(request$);

		const {totalSize} = response;
		let {items} = response;

		if (totalSize > +environment.config.syncManager.pull.pageSize) {

			paginationEmitter.emit(something.name, {
				...something,
				totalSize,
				updatedSince
			});

		}

		items = items.map(create) as unknown as BaseItem[];

		/**
		 * If lastFinishedSyncStart is available, it means we are in the middle of a sync process, and we need to return only changes.
		 * Because we already have all the items in the syncManager instance.
		 * And if we return just items, it will cause delete exist data and add new items.
		 * So, we need to return only changes if lastFinishedSyncStart is available.
		 */
		if (lastFinishedSyncStart) {
			return {
				changes: {
					added: items,
					modified: [],
					removed: []
				}
			};
		}

		return {items};
	},
	push: async ({endpoint, toDTO}, {changes}) => {

		await Promise.all(changes.added.map(async (raw) => {
			const dto = toDTO(raw);
			const body = dto;

			const request$ = httpClient.post(endpoint.post, body);

			await firstValueFrom(request$)
				.then((response) => {
					console.log('SignalDB:push:added:response', {response})

				}).catch((response) => {

					if (response.status >= 400 && response.status <= 499) {
						errorEmitter.emit('error', response)
					}

				});

		}))

		await Promise.all(changes.modified.map(async (item: { id: string }) => {
			const body = item;
			const dto = toDTO(body);

			const request$ = httpClient.put(endpoint.put, body, {
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id: dto._id,
				}),
			});

			await firstValueFrom(request$)
				.then((response) => {

					console.log('SignalDB:push:added:response', {response})

				}).catch((response) => {

					if (response.status >= 400 && response.status <= 499) {
						errorEmitter.emit('error', response)
					}

				});

		}))

		await Promise.all(changes.removed.map(async (item: { id: string }) => {

			// const body = item;

			const request$ = httpClient.delete(endpoint.delete, {
				context: new HttpContext().set(TokensHttpContext.REPLACE, {
					id: item.id,
				}),
			});

			await firstValueFrom(request$)
				.then((response) => {

					console.log('SignalDB:push:added:response', {response})

				}).catch((response) => {

					if (response.status >= 400 && response.status <= 499) {
						errorEmitter.emit('error', response)
					}

				});

		}))
	},
});

// TODO find a way to delete providedIn: 'root' from the class decorator
@Injectable({
	providedIn: 'root'
})
export class SyncManagerService extends Reactive {

	private readonly httpClient = inject(HttpClient);
	// private readonly currentTenantId = inject(CURRENT_TENANT_ID);
	private readonly tenantId$ = inject(TENANT_ID);
	private readonly lastSynchronizationInService = inject(LastSynchronizationInService);

	readonly #isSyncing$ = new BehaviorSubject<boolean>(false);

	public readonly isSyncing$ = this.#isSyncing$.asObservable();

	#syncManager!: SyncManager<Record<string, BaseItem>, BaseItem, string>;
	#tenantId!: string;

	public static readonly isLoadingPerCollection = new Map<string, boolean>();

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: SyncManagerService,
	) {

		super();

		// console.log('SyncManagerService', {otherInstance}, this.currentTenantId)
		//
		if (otherInstance) {
			/**
			 * SyncManagerService is already provided
			 */
			return otherInstance;
		}

		// this.#tenantId = this.currentTenantId;

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {

			this.#tenantId = tenantId;

			let syncManager = SyncManagerService.syncMangers.get(this.#tenantId);

			if (!syncManager) {

				syncManager = getSyncMangerInstance(this.httpClient, this.#tenantId);

				SyncManagerService.syncMangers.set(this.#tenantId, syncManager);

			}

			this.#syncManager = syncManager;

		});

	}


	/**
	 * Add collection to syncManager instance if you need to sync data with server
	 * @param tenantId
	 * @param collection
	 * @param options
	 */
	public addCollection(tenantId: string, collection: Collection, options: any) {

		if (tenantId !== this.#tenantId) {
			throw new Error('TenantId does not match');
		}

		/**
		 * Check if collection already exists in syncManager instance before adding it!
		 * This is important because syncManager instance is shared across the application and we don't want to add the same collection multiple times.
		 * Because it will cause syncManager to sync the same collection multiple times and it will cause not stop syncing (A call B, B call A instance).
		 */

		try {

			/**
			 * If collection already exists in syncManager instance, it will throw an error and we can safely ignore it.
			 */

			this.#syncManager.getCollectionProperties(collection.name);

		} catch {

			/**
			 * Catch means collection not found in syncManager instance and it is safe to add it.
			 */

			this.#syncManager.addCollection(collection, options);

			/**
			 * Listen to paginationEmitter to get all pages of data from the server
			 */

			paginationEmitter.on(`${collection.name}-start`, () => {
				SyncManagerService.isLoadingPerCollection.set(collection.name, true);
				this.updateSynchronizationStatus();
			});

			paginationEmitter.on(`${collection.name}-finish`, () => {
				this.#isSyncing$.next(false);
				SyncManagerService.isLoadingPerCollection.set(collection.name, false);
				this.updateSynchronizationStatus();
			});

		}

	}

	private updateSynchronizationStatus() {
		const someCollectionLoading = Array.from(SyncManagerService.isLoadingPerCollection.values()).some(is.true);
		this.#isSyncing$.next(someCollectionLoading);
	}

	public async syncAll() {
		this.#isSyncing$.next(true);
		await this.getSyncManager().syncAll();
		this.lastSynchronizationInService.setLastSynchronizedIn();
		this.#isSyncing$.next(false);
	}

	public getSyncManager() {
		return this.#syncManager;
	}

	public get lastSynchronizedIn() {
		return this.lastSynchronizationInService.getLastSynchronizedIn();
	}

	public static readonly syncMangers = new Map<string, SyncManager<Record<string, BaseItem>, BaseItem, string>>();

}
