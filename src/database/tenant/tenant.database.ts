import Dexie, {Table} from 'dexie';
import {ICustomer} from "@customer/domain";
import {IBaseEntity} from "@utility/domain";

export interface ILocalEntity<T extends IBaseEntity<string>> {
	_id: string;
	data: T;
	syncedAt: string;
	deletedAt: string;
}

export class LocalEntity<T extends IBaseEntity<string>> implements ILocalEntity<T> {

	public constructor(
		public _id: string,
		public data: T,
		public syncedAt: string,
		public deletedAt: string,
	) {
	}

	public static create<T extends IBaseEntity<string>>(data: T, syncedAt: string = '') {
		const {_id} = data;
		return new LocalEntity(_id, data, syncedAt, '');
	}
}

export class TenantDatabase extends Dexie {

	customer!: Table<LocalEntity<ICustomer>>;

	public constructor(tenantId: string) {

		super(`tenant_${tenantId}`);

		this.version(1).stores({

			customer: '_id, syncedAt, deletedAt, data.createdAt, data.active', // Індекси

		});

	}

}
