import {BaseItem, Collection, createIndex, EventEmitter, loadDeveloperTools} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ActiveEnum, OrderDirEnum} from "@utility/domain/enum";
import {ICustomer, validCustomer} from "@customer/domain";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import ObjectID from "bson-objectid";
import indexedDBAdapterPersistenceSignalDB
	from "@src/database/tenant/signaldb/persistence/adapter/indexedDB.adapter.persistence.signalDB";

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
interface IUser extends BaseItem<string> {
	firstName: string;
	lastName: string;
	createdAt: number;
}

export class User extends BaseEntity<IUser> {

	// getPosts() {
	// 	return Posts.find({ authorId: this.id })
	// }

}

const toUser = (data: IUser) => new User(data);

export const Users = new Collection<IUser, string, User>({
	reactivity: angularReactivityAdapter,
	persistence: createIndexedDBAdapter('users'),
	transform: toUser,
	indices: [
		createIndex('createdAt'),
	]
});

Users.isReady().then(() => {
	Users.insert({
		id: new ObjectID().toHexString(),
		firstName: 'Mark',
		lastName: 'Smith',
		createdAt: Date.now()
	})
})

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

	children: ICustomerEntity[];

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

	children!: ICustomerEntity[];
	child!: ICustomerEntity;

	public static create(data: ICustomer, level = 0): Customer {

		const valid = validCustomer(data);

		if (!valid.success) {
			console.error(valid);
			throw new Error('Invalid customer data');
		}

		const children = [];

		if (level < 3) {
			children.push(
				Customer.create({
					...data,
					_id: new ObjectID().toHexString()
				}, level + 1)
			)
		}

		return new Customer({
			...data,
			id: data._id,
			children,
			child: new Customer({
				...data,
				id: new ObjectID().toHexString(),
				children: [],
			})
		});
	}

	public toDto(): ICustomer {
		const {id, children, child, ...data} = this;
		return data;
	}

}

const toCustomer = Customer.create;

export const Customers = new Collection<ICustomerEntity, string, Customer>({
	reactivity: angularReactivityAdapter,
	persistence: indexedDBAdapterPersistenceSignalDB({
		databaseName: 'tenant-test',
		storeName: 'customers',
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
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6ImVuIiwidGhlbWUiOiJsaWdodCJ9fSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2JlZW9jbG9jay1kZXZlbG9wIiwiYXVkIjoiYmVlb2Nsb2NrLWRldmVsb3AiLCJhdXRoX3RpbWUiOjE3Mzc4MjU4ODMsInVzZXJfaWQiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwic3ViIjoieHhsWXlPVGhFSlA5V2RnZjh6ZmtQbTNYYlI4MyIsImlhdCI6MTczNzg1MzU3MSwiZXhwIjoxNzM3ODU3MTcxLCJlbWFpbCI6ImRlbW9AYmVlb2Nsb2NrLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrNDgxMDAyMDAzMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AYmVlb2Nsb2NrLmNvbSJdLCJwaG9uZSI6WyIrNDgxMDAyMDAzMDAiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Av7sMlpjfukl8suq49Hq2SXQqmsGb7cosAZ_SY5ozoJokx7jARVPDL8F-P6wDBkpQZvBPKc6401RyKghoRVfMD7t43yNjQuQfXm154yBfE2vfNbSHQNQF5YNYeP8Qf8-cLKntKCtcWgT5zXP6aLTGqEZ-EIEUtbtSspizaLfSmHpS1qpNLGQ5AWKfsmHNzb_eMcLz4hyBLszKo6qElZL4u27m_QxRDvMlL1PyoRjyks8iDsDW0zTUE7-hzMUHOPNwto6Pv8WwmzC1IPoFDEr_5cu9B6u2b0aTGeN4GJysoGCig0ynRyipQWrRGFI8qmICbhBP191pJXb9z1B5m5y6A'
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
			.then(data => data as ResponseListType<ICustomer>);

		console.log('SignalDB:pull:data', {data});

		const items = data.items.map(Customer.create);

		console.log('SignalDB:pull:items', {items});

		return {changes: {added: items, modified: [], removed: []}};
	},
	push: async ({apiPath}, {changes}) => {

		console.log('SignalDB:push:params', {apiPath, changes});

		await Promise.all(changes.added.map(async (raw) => {
			console.log('SignalDB:push:added', {raw});
			const item = Customer.create(raw);
			const body = item.toDto();
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

		await Promise.all(changes.modified.map(async (item) => {
			const body = item.toDto();
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

		await Promise.all(changes.removed.map(async (item) => {
			const body = item.toDto();
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
