import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {ICustomer} from "@core/business-logic/customer";
import {firstValueFrom, Observable} from "rxjs";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";

type ENTITY = ICustomer.Entity;

@Injectable()
export class CustomerService {

	#db: Table<ENTITY> | null = null;

	public constructor(
		public readonly repository: BaseRepository<ENTITY>,
	) {

		this.initDB().then();

	}

	public get db(): Table<ENTITY> {
		if (!this.#db) {
			throw new Error('Table not initialized');
		}
		return this.#db;
	}

	public async initDB(): Promise<void> {

		if ('db$' in this.repository.dataProvider) {

			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY>> };
			this.#db = await firstValueFrom(db$);

		}

	}

	public async findOneByEmailPhone(either: {
		email?: string | null;
		phone?: string | null;
	}) {
		if (either?.email && either.email.length > 0) {
			// Find by email
			const customer = await this.db.where('email').equals(either.email).first();
			if (customer) return customer;
		}

		if (either?.phone && either.phone.length > 0) {
			// Find by phone
			const customer = await this.db.where('phone').equals(either.phone).first();
			if (customer) return customer;
		}

		return null;
	}

	// public async findByEither(either: {
	// 	email?: string;
	// 	phone?: string;
	// }) {
	// 	const keys = Object.keys(either);
	// 	const values = Object.values(either);
	// 	// const customers = await this.db
	// 	// 	.where(`[${keys.join('+')}]`)
	// 	// 	.anyOf([values, ])
	// 	// 	.toArray();
	//
	// 	return customers;
	// }

}
