import {BaseItem, Collection, EventEmitter } from '@signaldb/core';
import createIndexedDBAdapter from '@signaldb/indexeddb'
import angularReactivityAdapter from '@signaldb/angular';
import { SyncManager } from '@signaldb/sync'
import {Types} from "@utility/types";
import {CustomerTypeEnum} from "@customer/domain/enum/customer-type.enum";
import {ActiveEnum, OrderDirEnum} from "@utility/domain/enum";

class BaseEntity<T> implements BaseItem<string> {

	id!: string;

	constructor(data: T) {
		Object.assign(this, data)
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

interface ICustomer extends BaseItem<string> {

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

export class Customer extends BaseEntity<ICustomer> {

}

const toCustomer = (data: ICustomer) => new Customer(data);

export const Customers = new Collection<ICustomer, string, Customer>({
	reactivity: angularReactivityAdapter,
	persistence: createIndexedDBAdapter('customers'),
	transform: toCustomer,
});

Promise.all([
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

	const syncManager = new SyncManager({
		pull: async ({ apiPath }) => {
			console.log({apiPath})
			const queryParams = new URLSearchParams({
				orderBy: 'updatedAt',
				orderDir: OrderDirEnum.DESC,
				page: '1',
				pageSize: '10',
			}).toString();
			const data = await fetch(`https://api-dev.beeoclock.com/panel/${apiPath}?${queryParams}`, {
				headers: {
					'X-Business-Tenant-Id': '66f9378141ed7954254c40c8',
					Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxYjUyMjFlN2E1ZGUwZTVhZjQ5N2UzNzVhNzRiMDZkODJiYTc4OGIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoidGVzdCIsImFjY291bnRJZCI6IjY2ZjkzMTgxNDFlZDc5NTQyNTRjNDBiZCIsImZyb250ZW5kU2V0dGluZ3MiOnsiYnVzaW5lc3NQYW5lbCI6eyJsYW5ndWFnZSI6ImVuIiwidGhlbWUiOiJsaWdodCJ9fSwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2JlZW9jbG9jay1kZXZlbG9wIiwiYXVkIjoiYmVlb2Nsb2NrLWRldmVsb3AiLCJhdXRoX3RpbWUiOjE3Mzc3NDk2MjQsInVzZXJfaWQiOiJ4eGxZeU9UaEVKUDlXZGdmOHpma1BtM1hiUjgzIiwic3ViIjoieHhsWXlPVGhFSlA5V2RnZjh6ZmtQbTNYYlI4MyIsImlhdCI6MTczNzc1NTg0NywiZXhwIjoxNzM3NzU5NDQ3LCJlbWFpbCI6ImRlbW9AYmVlb2Nsb2NrLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrNDgxMDAyMDAzMDAiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImRlbW9AYmVlb2Nsb2NrLmNvbSJdLCJwaG9uZSI6WyIrNDgxMDAyMDAzMDAiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.RliUWZi1pwfPiR65FbAcZHpa78TCXVZiFj7EwjoE2Kds-VVSwXvhT01iSZQkypwo6mFFrv-lr06ew3oY_Ir6K-PsYYTWFk2eeQrk1Dn-oVCQsngg9QX_yu-bskQZyWMdpC_e1sqy89znDgdqWKLnjKcwkt_yYoWCnJt7au0Azxvpwo_Q2ZbTeOTq0RHp54CmxPFdW-Yeqk-AIlm3oNNzCfl7beSCeHRt8cxVx9kAx4bUULrt90_Dp7EAVrsr-5H7GFJEjOt6bqqLoM77mkkAVl3C7mrkEgZ7oAHSVhcJuV_pPbhzRl4F2DWqFtz51GtEy9R4z06Rv3Vm-8Oy82sPMA'
				}
			}).then(res => res.json());
			console.log(data);
			return { items: data.items }
		},
		push: async ({ apiPath }, { changes }) => {

			console.log({apiPath, changes});

			await Promise.all(changes.added.map(async (item) => {
				const response = await fetch(apiPath, { method: 'POST', body: JSON.stringify(item) })
				const responseText = await response.text()
				if (response.status >= 400 && response.status <= 499) {
					errorEmitter.emit('error', responseText)
					return
				}
			}))

			await Promise.all(changes.modified.map(async (item) => {
				const response = await fetch(apiPath, { method: 'PUT', body: JSON.stringify(item) })
				const responseText = await response.text()
				if (response.status >= 400 && response.status <= 499) {
					errorEmitter.emit('error', responseText)
					return
				}
			}))

			await Promise.all(changes.removed.map(async (item) => {
				const response = await fetch(apiPath, { method: 'DELETE', body: JSON.stringify(item) })
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
		apiPath: 'api/v1/customer/paged',
	});
	// syncManager.addCollection(Users, {
	// 	name: 'users',
	// 	apiPath: '/users',
	// });

})
