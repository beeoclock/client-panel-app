import {EventEmitter} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {OrderByEnum, OrderDirEnum} from "@utility/domain/enum";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {TokensHttpContext} from "@src/tokens.http-context";
import {TENANT_ID} from "@src/token";


/**
 * Absence
 */

// interface IAbsenceEntity extends BaseItem<string> {
//
//     _id: string & Types.ObjectId;
//     createdAt: string & Types.DateTime;
//     updatedAt: string & Types.DateTime;
//     object: 'AbsenceDto';
//
//     note: string;
//     active: ActiveEnum;
//     start: string;
//     end: string;
//     type: AbsenceTypeEnum;
//     entireBusiness: boolean;
//     members: RIMember[];
//     // locations?: LocationDto[]; // TODO
//     timeZone: string;
//     // meta?: MetaDto;
//
// }
//
// export class Absence extends BaseEntity<IAbsenceEntity> implements IAbsenceEntity {
//
//     _id!: string & Types.ObjectId;
//     createdAt!: string & Types.DateTime;
//     updatedAt!: string & Types.DateTime;
//     object!: 'AbsenceDto';
//
//
//     active!: ActiveEnum;
//     end!: string;
//     entireBusiness!: boolean;
//     members!: RIMember[];
//     note!: string;
//     start!: string;
//     timeZone!: string;
//     type!: AbsenceTypeEnum;
//
//
//     public static create(data: IAbsenceDto): Absence {
//
//         const valid = validAbsence(data);
//
//         if (!valid.success) {
//             console.error(valid);
//             throw new Error('Invalid Absence data');
//         }
//
//         return new Absence({
//             ...data,
//             id: data._id,
//         });
//     }
//
//     public toDto(): IAbsenceDto {
//         const {id, ...data} = this;
//         return data;
//     }
//
// }
//
// const toAbsence = Absence.create;
//
// export const Absences = new Collection<IAbsenceEntity, string, Absence>({
//     reactivity: angularReactivityAdapter,
//     persistence: indexedDBAdapterPersistenceSignalDB({
//         databaseName: 'tenant-test-absence',
//         storeName: 'items',
//         version: 1,
//         storeParameters: {
//             keyPath: 'id',
//             autoIncrement: false,
//         },
//         indexes: [
//             {name: 'createdAt', keyPath: 'createdAt'},
//
//             // {name: 'child.firstName', keyPath: 'child.firstName'},
//             // From array
//             // https://stackoverflow.com/questions/36034150/indexeddb-multyentry-with-sub-objects
//             // https://github.com/w3c/IndexedDB/issues/35
//             // {name: 'children.lastName', keyPath: 'children.lastName'},
//
//             // Use multiEntry: true for array, e.g. you can prepare Orders.services.serviceSnapshot.id, Orders.services.appointment.attendees.customer.id to find every order with a specific customer
//         ],
//     }),
//     transform: toAbsence,
//     enableDebugMode: true,
// });

const errorEmitter = new EventEmitter();
errorEmitter.on('error', (message: unknown) => {
	console.log({message})
	// display validation errors to the user
});

const getSyncMangerInstance = (httpClient: HttpClient) => new SyncManager({
	// autostart: false,
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

			const body = item;

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

export const syncManagerConfigurationRegister: (() => {
	collection: never;
	options: {
		name: string;
		apiPath: string;
		toDTO: (raw: never) => never;
		create: (data: never) => never;
	};
})[] = [];

@Injectable()
export class SyncManagerService {

	private readonly httpClient = inject(HttpClient);
	private readonly tenantId$ = inject(TENANT_ID);

	private readonly syncManager = SyncManagerService.syncMangers[this.tenantId$.value ?? ''];

	public constructor() {
		const tenantId = this.tenantId$.value ?? '';
		if (!SyncManagerService.syncMangers[tenantId]) {
			SyncManagerService.syncMangers[tenantId] = getSyncMangerInstance(this.httpClient);
			this.syncManager = SyncManagerService.syncMangers[tenantId];
			syncManagerConfigurationRegister.forEach((getSyncConfiguration) => {
				const {collection, options} = getSyncConfiguration();
				this.syncManager.addCollection(collection, options);
			});
		}
	}

	public getSyncManager() {
		return this.syncManager;
	}

	public static syncMangers: {
		[tenantId: string]: SyncManager<Record<string, any>, never, any>;
	} = {};

}
