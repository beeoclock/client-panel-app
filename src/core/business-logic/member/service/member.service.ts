import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {firstValueFrom, Observable} from "rxjs";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IMember} from "@core/business-logic/member/interface/i.member";

type ENTITY = IMember.Entity;

@Injectable()
export class MemberService {

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
			const item = await this.db.where('email').equals(either.email).first();
			if (item) return item;
		}

		if (either?.phone && either.phone.length > 0) {
			// Find by phone
			const item = await this.db.where('phone').equals(either.phone).first();
			if (item) return item;
		}

		return null;
	}

}
