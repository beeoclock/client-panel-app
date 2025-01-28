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
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE0MzRmMzFkN2Y3NWRiN2QyZjQ0YjgxZDg1MjMwZWQxN2ZlNTk3MzciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6InBsIn19LCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmVlb2Nsb2NrLWRldmVsb3AiLCJhdWQiOiJiZWVvY2xvY2stZGV2ZWxvcCIsImF1dGhfdGltZSI6MTczODA5MDI4MywidXNlcl9pZCI6Inh4bFl5T1RoRUpQOVdkZ2Y4emZrUG0zWGJSODMiLCJzdWIiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwiaWF0IjoxNzM4MDk3NzA3LCJleHAiOjE3MzgxMDEzMDcsImVtYWlsIjoiZGVtb0BiZWVvY2xvY2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX251bWJlciI6Iis0ODEwMDIwMDMwMCIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZGVtb0BiZWVvY2xvY2suY29tIl0sInBob25lIjpbIis0ODEwMDIwMDMwMCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Bo-7hEsWpYBBLwyAtA_5FU5F_t7upkoJcM_2olO3N-DzwaqfHfnOShfBsBPwy1ok24A4Mc7FYIcIWQ9916nNGEH1LmwEvPGZXz84B_IN3_0_IrcZFRYdip-JPhi0weE9mbsqHJGeYSzA2HssH0OPzWA4XOoH9WQUgf_3zDjac38jdSu1SDuK7f5iNMu_xDEZXKp-KYIJJMARxJoJvPx4sXD2Tj_b1LYDqJhNtqEGYZdUAvM53y-gFox_dVaG5rKgQJq_hIouMMLoe0JGtPHqmg0DH_gJXM_zHnVgKAU85EY4F3wK6j0HeI4Hy_NC5n2ZqdzdO6ryOm20-0d8RTZDwA'
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
    pull: async (something, pullParameters) => {
        const {apiPath} = something;
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

        const {items} = data;

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
