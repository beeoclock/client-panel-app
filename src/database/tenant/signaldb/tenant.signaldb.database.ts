import {BaseItem, Collection, EventEmitter, loadDeveloperTools} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ActiveEnum, OrderDirEnum} from "@utility/domain/enum";
import {ICustomer, validCustomer} from "@customer/domain";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import indexedDBAdapterPersistenceSignalDB
	from "@src/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";
import {AbsenceTypeEnum} from "@absence/domain/enums/absence.type.enum";
import {RIMember} from "@member/domain";
import {IAbsenceDto, validAbsence} from "@absence/external/interface/i.absence.dto";
import {signalStore, withState,} from '@ngrx/signals';

loadDeveloperTools();

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

interface IAbsenceEntity extends BaseItem<string> {

	_id: string & Types.ObjectId;
	createdAt: string & Types.DateTime;
	updatedAt: string & Types.DateTime;
	object: 'AbsenceDto';

	note: string;
	active: ActiveEnum;
	start: string;
	end: string;
	type: AbsenceTypeEnum;
	entireBusiness: boolean;
	members: RIMember[];
	// locations?: LocationDto[]; // TODO
	timeZone: string;
	// meta?: MetaDto;

}

export class Absence extends BaseEntity<IAbsenceEntity> implements IAbsenceEntity {

	_id!: string & Types.ObjectId;
	createdAt!: string & Types.DateTime;
	updatedAt!: string & Types.DateTime;
	object!: 'AbsenceDto';


	active!: ActiveEnum;
	end!: string;
	entireBusiness!: boolean;
	members!: RIMember[];
	note!: string;
	start!: string;
	timeZone!: string;
	type!: AbsenceTypeEnum;


	public static create(data: IAbsenceDto): Absence {

		const valid = validAbsence(data);

		if (!valid.success) {
			console.error(valid);
			throw new Error('Invalid Absence data');
		}

		return new Absence({
			...data,
			id: data._id,
		});
	}

	public toDto(): IAbsenceDto {
		const {id, ...data} = this;
		return data;
	}

}

const toAbsence = Absence.create;

export const Absences = new Collection<IAbsenceEntity, string, Absence>({
	reactivity: angularReactivityAdapter,
	persistence: indexedDBAdapterPersistenceSignalDB({
		databaseName: 'tenant-test-absence',
		storeName: 'items',
		version: 1,
		storeParameters: {
			keyPath: 'id',
			autoIncrement: false,
		},
		indexes: [
			{name: 'createdAt', keyPath: 'createdAt'},

			// {name: 'child.firstName', keyPath: 'child.firstName'},
			// From array
			// https://stackoverflow.com/questions/36034150/indexeddb-multyentry-with-sub-objects
			// https://github.com/w3c/IndexedDB/issues/35
			// {name: 'children.lastName', keyPath: 'children.lastName'},

			// Use multiEntry: true for array, e.g. you can prepare Orders.services.serviceSnapshot.id, Orders.services.appointment.attendees.customer.id to find every order with a specific customer
		],
	}),
	transform: toAbsence,
	enableDebugMode: true,
});

/**
 * Posts
 */

class PostsCollection extends Collection<IPost> {
	constructor() {
		super({
			name: 'posts',
			reactivity: angularReactivityAdapter,
			persistence: indexedDBAdapterPersistenceSignalDB({
				databaseName: 'tenant-test-posts',
				storeName: 'items',
				version: 1,
				storeParameters: {
					keyPath: 'id',
					autoIncrement: false,
				}
			}),
			transform: Post.create,
		})
	}

	getPublishedPosts() {
		return this.find({published: true})
	}

}

interface IPost extends BaseItem<string> {
	title: string;
	content: string;
	authorId: string;
	createdAt: number;
	published: boolean;
}

class Post extends BaseEntity<IPost> implements IPost {

    title!: string;
    content!: string;
    authorId!: string;
    createdAt!: number;
    published!: boolean;


	public static create(data: IPost): Post {
		return new Post(data);
	}

	public static readonly collection = new PostsCollection();
	public static readonly store = signalStore(
		{providedIn: 'root'},
		withState({}),
	);

}


/**
 * CUSTOMER
 */


interface ICustomerEntity extends BaseItem<string> {

	_id: string & Types.ObjectId;
	createdAt: string & Types.DateTime;
	updatedAt: string & Types.DateTime;
	object: 'CustomerDto';

	firstName: string & Types.MaxLength<50> | null;
	lastName: string & Types.MaxLength<50> | null;
	phone: string | null;
	email: string & Types.Email | null;
	note: string | null;
	customerType: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;

	active: ActiveEnum;
}

export class Customer extends BaseEntity<ICustomerEntity> implements ICustomerEntity {

	_id!: string & Types.ObjectId;
	createdAt!: string & Types.DateTime;
	updatedAt!: string & Types.DateTime;
	object!: 'CustomerDto';
	firstName!: (string & Types.MaxLength<50>) | null;
	lastName!: (string & Types.MaxLength<50>) | null;
	phone!: string | null;
	email!: (string & Types.Email) | null;
	note!: string | null;
	customerType!: CustomerTypeEnum & Types.Default<CustomerTypeEnum.new>;
	active!: ActiveEnum;

	public static create(data: ICustomer): Customer {

		const valid = validCustomer(data);

		if (!valid.success) {
			console.error(valid);
			throw new Error('Invalid customer data');
		}

		return new Customer({
			...data,
			id: data._id,
		});
	}

	public toDto(): ICustomer {
		const {id, ...data} = this;
		return data;
	}

}

const toCustomer = Customer.create;

export const Customers = new Collection<ICustomerEntity, string, Customer>({
	reactivity: angularReactivityAdapter,
	persistence: indexedDBAdapterPersistenceSignalDB({
		databaseName: 'tenant-test-customer',
		storeName: 'items',
		version: 1,
		storeParameters: {
			keyPath: 'id',
			autoIncrement: false,
		},
		indexes: [
			{name: '_id', keyPath: '_id'},
			{name: 'createdAt', keyPath: 'createdAt'},
			{name: 'child.firstName', keyPath: 'child.firstName'},
			// From array
			// https://stackoverflow.com/questions/36034150/indexeddb-multyentry-with-sub-objects
			// https://github.com/w3c/IndexedDB/issues/35
			{name: 'children.lastName', keyPath: 'children.lastName'},
		]
	}),
	transform: toCustomer,
	enableDebugMode: true,
});


const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-Business-Tenant-Id': '66f9378141ed7954254c40c8',
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6ImVuIn19LCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmVlb2Nsb2NrLWRldmVsb3AiLCJhdWQiOiJiZWVvY2xvY2stZGV2ZWxvcCIsImF1dGhfdGltZSI6MTczNzgyNTg4MywidXNlcl9pZCI6Inh4bFl5T1RoRUpQOVdkZ2Y4emZrUG0zWGJSODMiLCJzdWIiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwiaWF0IjoxNzM3OTExNTI0LCJleHAiOjE3Mzc5MTUxMjQsImVtYWlsIjoiZGVtb0BiZWVvY2xvY2suY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX251bWJlciI6Iis0ODEwMDIwMDMwMCIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZGVtb0BiZWVvY2xvY2suY29tIl0sInBob25lIjpbIis0ODEwMDIwMDMwMCJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.RuotAWV2WvEvCvHB1-Cr7lIS1TZ2kZp05oK5pleiRfhqRZXVanB5XUY3G2m86SA4a4xIV_aNfjNu2qhLq-sFr97pR31ju5Gp8lWxOE_bN99RYHLn1mkjWWEk-e8Kq_GXF42nwIGvy__ZetqkHKTuwMEAIN_ckJpFX_pOndiHClJQ3wro-CdhskBQQJva00dfh-6jIjlFl39vsyWBAUmm4H1sBRBlT88dWBc-abuSwYN8MtLZ4Vz4O2aKowOgfjQskYkOXtV1iRYr3BOtQrq6geuzFnxuRmpAGdjlzSfnJFGMRa6x05h1u-dgj9roJRTp2bWPdq1WPQv70wQ6y3auJA'
};

const customers = Customers.find().fetch();
console.log('Promise.all: ', customers);


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

		return {changes: {added: items, modified: [], removed: []}};
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

		await Promise.all(changes.modified.map(async (item: {id: string}) => {
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

		await Promise.all(changes.removed.map(async (item: {id: string}) => {
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

syncManager.addCollection(Customers, {
	name: 'customers',
	apiPath: 'api/v1/customer',
});

syncManager.addCollection(Post.collection, {
	name: 'posts',
	apiPath: 'api/v1/posts',
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
