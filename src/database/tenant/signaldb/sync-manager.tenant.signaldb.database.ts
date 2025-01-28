import {BaseItem, EventEmitter} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {OrderDirEnum} from "@utility/domain/enum";
import {ResponseListType} from "@utility/adapter/base.api.adapter";

abstract class BaseEntity<T extends object> implements BaseItem<string> {

    id!: string;

    public constructor(data: T) {
        Object.assign(this, data);
    }

}

// interface IPost extends BaseItem<string> {
// 	title: string,
// 	content: string,
// 	authorId: string,
// 	createdAt: number,
// }
//
// export class Post extends BaseEntity<IPost> {
//
// 	title!: string;
// 	content!: string;
// 	authorId!: string;
// 	createdAt!: number;
//
// 	getAuthor() {
// 		return Users.findOne({
// 			id: this.authorId
// 		})
// 	}
// }
//
// const toPost = (data: IPost) => new Post(data);
//
// export const Posts = new Collection<IPost, string, Post>({
// 	reactivity: angularReactivityAdapter,
// 	persistence: createIndexedDBAdapter('posts'),
// 	transform: toPost
// });
//
// interface IUser extends BaseItem<string> {
// 	firstName: string;
// 	lastName: string;
// 	createdAt: number;
// }
//
// export class User extends BaseEntity<IUser> {
//
// 	// getPosts() {
// 	// 	return Posts.find({ authorId: this.id })
// 	// }
//
// }
//
// const toUser = (data: IUser) => new User(data);
//
// export const Users = new Collection<IUser, string, User>({
// 	reactivity: angularReactivityAdapter,
// 	persistence: createIndexedDBAdapter('users'),
// 	transform: toUser,
// 	indices: [
// 		createIndex('createdAt'),
// 	]
// });
//
// Users.isReady().then(() => {
// 	Users.insert({
// 		id: new ObjectID().toHexString(),
// 		firstName: 'Mark',
// 		lastName: 'Smith',
// 		createdAt: Date.now()
// 	})
// })


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


/**
 * CUSTOMER
 */


// interface ICustomerEntity extends BaseItem<string> {
//
// 	_id: string & Types.ObjectId;
// 	createdAt: string & Types.DateTime;
// 	updatedAt: string & Types.DateTime;
// 	object: 'CustomerDto';
//
// 	firstName: string & Types.MaxLength<50> | null;
// 	lastName: string & Types.MaxLength<50> | null;
// 	phone: string | null;
// 	email: string & Types.Email | null;
// 	note: string | null;
// 	customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
//
// 	active: ActiveEnum;
// }
//
// export class Customer extends BaseEntity<ICustomerEntity> implements ICustomerEntity {
//
// 	_id!: string & Types.ObjectId;
// 	createdAt!: string & Types.DateTime;
// 	updatedAt!: string & Types.DateTime;
// 	object!: 'CustomerDto';
// 	firstName!: (string & Types.MaxLength<50>) | null;
// 	lastName!: (string & Types.MaxLength<50>) | null;
// 	phone!: string | null;
// 	email!: (string & Types.Email) | null;
// 	note!: string | null;
// 	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
// 	active!: ActiveEnum;
//
// 	public static create(data: ICustomer): Customer {
//
// 		const valid = validCustomer(data);
//
// 		if (!valid.success) {
// 			console.error(valid);
// 			throw new Error('Invalid customer data');
// 		}
//
// 		return new Customer({
// 			...data,
// 			id: data._id,
// 		});
// 	}
//
// 	public toDto(): ICustomer {
// 		const {id, ...data} = this;
// 		return data;
// 	}
//
// }
//
// const toCustomer = Customer.create;
//
// export const Customers = new Collection<ICustomerEntity, string, Customer>({
// 	reactivity: angularReactivityAdapter,
// 	persistence: indexedDBAdapterPersistenceSignalDB({
// 		databaseName: 'tenant-test-customer',
// 		storeName: 'items',
// 		version: 1,
// 		storeParameters: {
// 			keyPath: 'id',
// 			autoIncrement: false,
// 		},
// 		indexes: [
// 			{name: '_id', keyPath: '_id'},
// 			{name: 'createdAt', keyPath: 'createdAt'},
// 			{name: 'child.firstName', keyPath: 'child.firstName'},
// 			// From array
// 			// https://stackoverflow.com/questions/36034150/indexeddb-multyentry-with-sub-objects
// 			// https://github.com/w3c/IndexedDB/issues/35
// 			{name: 'children.lastName', keyPath: 'children.lastName'},
// 		]
// 	}),
// 	transform: toCustomer,
// 	enableDebugMode: true,
// });


const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Business-Tenant-Id': '66f9378141ed7954254c40c8',
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzRmMzFkN2Y3NWRiN2QyZjQ0YjgxZDg1MjMwZWQxN2ZlNTk3MzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6ImVuIiwidGhlbWUiOiJsaWdodCJ9fSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2JlZW9jbG9jay1kZXZlbG9wIiwiYXVkIjoiYmVlb2Nsb2NrLWRldmVsb3AiLCJhdXRoX3RpbWUiOjE3MzgxMDE0NDksInVzZXJfaWQiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwic3ViIjoieHhsWXlPVGhFSlA5V2RnZjh6ZmtQbTNYYlI4MyIsImlhdCI6MTczODEwMTQ0OSwiZXhwIjoxNzM4MTA1MDQ5LCJlbWFpbCI6ImRlbW9AYmVlb2Nsb2NrLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrNDgxMDAyMDAzMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AYmVlb2Nsb2NrLmNvbSJdLCJwaG9uZSI6WyIrNDgxMDAyMDAzMDAiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.CmYFeeURo5SfxWWXlSGh_nu4QN4MNUXqrgZOry4BQYVYJeQ_YeKg6_o-81l-HzrSfPFrDi6N3oUEpqcZU_x3xTA_WTS9sYXh4nPHX7_bmDFl8_BJLvO4UpOxiiCKHksYFJwh9h4GVTe4sJd7rznQHJkzEkWGCrM0or3RfnIf9k6Cjfp1lJKR3vhxuNrTuPi2AnkX2oeLMsa5gz600Xn5XL411cKb4rUaaBZ7pKr18-VdcBWsBUpk8YyfUVRiBmdVqpOHXjZ-wj6LHqTsNSvRZI_LQnm9xstjSUDRYKu0IbGJ49F1pgAiLSqmFMF-M7pxESj_hvjCCTazOLgFmb-xWg'
};

// const customers = Customers.find().fetch();
// console.log('Promise.all: ', customers);


const errorEmitter = new EventEmitter();
errorEmitter.on('error', (message: unknown) => {
    console.log({message})
    // display validation errors to the user
});

const source = `https://api-dev.beeoclock.com/panel`;

export const syncManager = new SyncManager({
    autostart: true,
    reactivity: angularReactivityAdapter,
    persistenceAdapter: createIndexedDBAdapter,
	// registerRemoteChange: async (collectionOptions, onChange)  => {
	// 	console.log('SignalDB:registerRemoteChange', {collectionOptions, onChange});
	// 	onChange().then((result) => {
	// 		console.log('SignalDB:registerRemoteChange:onChange:done', {result});
	// 	}).catch((error) => {
	// 		console.error('SignalDB:registerRemoteChange:onChange:error', {error});
	// 	});
	// },
    pull: async (something, pullParameters) => {
        const {apiPath, create} = something;
        const {lastFinishedSyncEnd} = pullParameters;

        console.log('SignalDB:pull:params', {something, pullParameters})

        // if (lastFinishedSyncEnd) {
        // 	const items = [] as Customer[];
        // 	return {changes: {added: items, modified: [], removed: []}};
        // }

        const updatedSince = lastFinishedSyncEnd ? new Date(lastFinishedSyncEnd).toISOString() : new Date(0).toISOString();

        const queryParams = new URLSearchParams({
            orderBy: 'updatedAt',
            orderDir: OrderDirEnum.DESC,
            page: '1',
            pageSize: '100',
            updatedSince
        }).toString();


        const data = await fetch(`${source}/${apiPath}/paged?${queryParams}`, {
            headers
        })
            .then(res => res.json())
            .then(data => data as ResponseListType<never>);

        console.log('SignalDB:pull:data', {data});

        let {items} = data;
		items = items.map(create) as never;

        // const items = data.items.map(Customer.create);

        console.log('SignalDB:pull:items', {items});

		if (lastFinishedSyncEnd) {
			return {changes: {added: items, modified: [], removed: []}};
		}

		return {items};
    },
    push: async ({apiPath}, {changes}) => {

        console.log('SignalDB:push:params', {apiPath, changes});

        await Promise.all(changes.added.map(async (raw) => {
            console.log('SignalDB:push:added', {raw});
            // const item = Customer.create(raw);
            // const body = item.toDto();
            // TODO: Create register to get model and create object to get toDto method
            const body = raw;
            console.log('SignalDB:push:added', {body});
            const response = await fetch(`${source}/${apiPath}`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers
            })
            const responseText = await response.text()
            if (response.status >= 400 && response.status <= 499) {
                errorEmitter.emit('error', responseText)
                return
            }
        }))

        await Promise.all(changes.modified.map(async (item: { id: string }) => {
            // const body = item.toDto();
            // TODO: Create register to get model and create object to get toDto method
            const body = item;
            console.log('SignalDB:push:modified', {body});
            const response = await fetch(`${source}/${apiPath}/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(body),
                headers
            })
            const responseText = await response.text()
            if (response.status >= 400 && response.status <= 499) {
                errorEmitter.emit('error', responseText)
                return
            }
        }))

        await Promise.all(changes.removed.map(async (item: { id: string }) => {
            // const body = item.toDto();
            // TODO: Create register to get model and create object to get toDto method
            const body = item;
            console.log('SignalDB:push:removed', {body});
            const response = await fetch(`${source}/${apiPath}/${item.id}`, {
                method: 'DELETE',
                body: JSON.stringify(body),
                headers
            })
            const responseText = await response.text()
            if (response.status >= 400 && response.status <= 499) {
                errorEmitter.emit('error', responseText)
                return
            }
        }))
    },
});

// syncManager.addCollection(Users, {
// 	name: 'users',
// 	apiPath: '/users',
// });

// export const syncManager = Promise.all([
// 	Customers.isReady(),
// 	// Users.isReady()
// ]).then(() => {
//
//
// 	return syncManager;
//
// })
