import {EventEmitter} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {inject, Injectable, Optional, SkipSelf} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {BehaviorSubject, filter, firstValueFrom} from "rxjs";
import {TokensHttpContext} from "@src/tokens.http-context";
import {LastSynchronizationInService} from "@utility/cdk/last-synchronization-in.service";
import {TENANT_ID} from "@src/token";
import {Reactive} from "@utility/cdk/reactive";
import {is} from "@utility/checker";

const errorEmitter = new EventEmitter();
errorEmitter.on('error', (message: unknown) => {
	console.log({message})
	// display validation errors to the user
});

const getSyncMangerInstance = (httpClient: HttpClient, tenantId: string) => new SyncManager({
	// autostart: false,
	id: tenantId,
	reactivity: angularReactivityAdapter,
	persistenceAdapter: createIndexedDBAdapter,
	pull: async (something, pullParameters) => {
		const {endpoint, create} = something;
		const {lastFinishedSyncEnd} = pullParameters;

		const updatedSince = lastFinishedSyncEnd ? new Date(lastFinishedSyncEnd).toISOString() : new Date(0).toISOString();

		const request$ = httpClient.get<ResponseListType<never>>(endpoint.get, {
			params: {
				orderBy: OrderByEnum.UPDATED_AT,
				orderDir: OrderDirEnum.DESC,
				page: '1',
				pageSize: '100',
				updatedSince
			}
		});
		const response = await firstValueFrom(request$);

		let {items} = response;
		items = items.map(create) as never;

		if (lastFinishedSyncEnd) {
			return {changes: {added: items, modified: [], removed: []}};
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

	#syncManager!: SyncManager<Record<string, any>, never, any>;
	#tenantId!: string;

	public constructor(
		@Optional()
		@SkipSelf()
		public readonly otherInstance: SyncManagerService,
	) {

		super();

		// console.log('SyncManagerService', {otherInstance}, this.currentTenantId)
		//
		// if (otherInstance) {
		// 	throw new Error('SyncManagerService is already provided');
		// }

		// this.#tenantId = this.currentTenantId;

		this.tenantId$.pipe(this.takeUntil(), filter(is.string)).subscribe((tenantId) => {

			this.#tenantId = tenantId;

			let syncManager = SyncManagerService.syncMangers.get(this.#tenantId);

			if (!syncManager) {

				syncManager = getSyncMangerInstance(this.httpClient, this.#tenantId);

				SyncManagerService.syncMangers.set(this.#tenantId, syncManager);

			}

			this.#syncManager = syncManager;

		})

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

	public static readonly syncMangers = new Map<string, SyncManager<Record<string, any>, never, any>>();

}
