import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {firstValueFrom, Observable} from "rxjs";

@Injectable()
export abstract class BaseService<ENTITY_RAW> {

	#db: Table<ENTITY_RAW> | null = null;

	public constructor(
		public readonly repository: BaseRepository<ENTITY_RAW>,
	) {
		this.initDB().then();
	}

	public get db(): Table<ENTITY_RAW> {
		if (!this.#db) {
			throw new Error('Table not initialized');
		}
		return this.#db;
	}

	public async initDB(): Promise<void> {

		if ('db$' in this.repository.dataProvider) {

			const {db$} = this.repository.dataProvider as { db$: Observable<Table<ENTITY_RAW>> };
			this.#db = await firstValueFrom(db$);

		}

	}

}
