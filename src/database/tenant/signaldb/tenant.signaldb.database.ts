import {BaseItem, Collection, EventEmitter} from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import {SyncManager} from '@signaldb/sync'
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ActiveEnum, OrderDirEnum} from "@utility/domain/enum";
import {ICustomer, validCustomer} from "@customer/domain";
import {ResponseListType} from "@utility/adapter/base.api.adapter";
import ObjectID from "bson-objectid";

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
// 	getPosts() {
// 		return Posts.find({ authorId: this.id })
// 	}
//
// }
//
// const toUser = (data: IUser) => new User(data);
//
// export const Users = new Collection<IUser, string, User>({
// 	reactivity: angularReactivityAdapter,
// 	persistence: createIndexedDBAdapter('users'),
// 	transform: toUser,
// });

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
	persistence: createIndexedDBAdapter('customers'),
	transform: toCustomer,
});

const headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'X-Business-Tenant-Id': '66f9378141ed7954254c40c8',
	Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6ImVuIiwidGhlbWUiOiJsaWdodCJ9fSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2JlZW9jbG9jay1kZXZlbG9wIiwiYXVkIjoiYmVlb2Nsb2NrLWRldmVsb3AiLCJhdXRoX3RpbWUiOjE3Mzc4MjU4ODMsInVzZXJfaWQiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwic3ViIjoieHhsWXlPVGhFSlA5V2RnZjh6ZmtQbTNYYlI4MyIsImlhdCI6MTczNzgyNTg5MCwiZXhwIjoxNzM3ODI5NDkwLCJlbWFpbCI6ImRlbW9AYmVlb2Nsb2NrLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrNDgxMDAyMDAzMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AYmVlb2Nsb2NrLmNvbSJdLCJwaG9uZSI6WyIrNDgxMDAyMDAzMDAiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.AhImmuaip-EYAC4uuVj-Nxl_XNoBpV0uYu1Eq9hBCTXfv0m1g7TKG0uP4qOOrK8cm1nQOS73Lelpj6mlgy8ZuKLG1Qs3A2OX916dwFi0kMTAdzB3suTkS0bG85hP6v4Whkuglgjfmq7soLAcpxPMBiPYawmoJQJupabnOXMLz1os2Z8a7vexV1eLRx0CK1SjMJSeW2ebAAZfmbmtMjXyr2exyeLm49wkX7WNA2n9bFvx5OtttbkV6tBgjkjf0SuS-zaCkGX2gv8DKLynYJ-AXqJ8FBww1ODKn-YnKjmFryOSyYAz13jQhA9Xsbg_uq1WSX0sJJsUHAI1RJmghOz-OQ'
};

export const syncManager = Promise.all([
	Customers.isReady(),
	// Users.isReady()
]).then(() => {

	const customers = Customers.find().fetch();
	console.log('Promise.all: ', customers);


	const errorEmitter = new EventEmitter();
	errorEmitter.on('error', (message: unknown) => {
		console.log({message})
		// display validation errors to the user
	});

	const source = `https://api-dev.beeoclock.com/panel`;

	const syncManager = new SyncManager({
		pull: async ({apiPath}) => {

			console.log('SignalDB:pull:params', {apiPath})

			const queryParams = new URLSearchParams({
				orderBy: 'updatedAt',
				orderDir: OrderDirEnum.DESC,
				page: '1',
				pageSize: '10',
			}).toString();

			const data = await fetch(`${source}/${apiPath}/paged?${queryParams}`, {
				headers
			})
				.then(res => res.json())
				.then(data => data as ResponseListType<ICustomer>);

			console.log('SignalDB:pull:data', {data});

			const items = data.items.map(Customer.create);

			console.log('SignalDB:pull:items', {items});

			return {items};
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

	return syncManager;

})
