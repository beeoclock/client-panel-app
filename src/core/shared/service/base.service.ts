import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {BehaviorSubject, map, Observable} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable()
export abstract class BaseService<ENTITY_RAW> {

	readonly #db$ = new BehaviorSubject<Table<ENTITY_RAW> | undefined>(undefined);

	public constructor(
		public readonly repository: BaseRepository<ENTITY_RAW>,
	) {
		(this.repository.dataProvider as unknown as { db$: Observable<Table<ENTITY_RAW>> })
			.db$
			.pipe(
				takeUntilDestroyed(),
				map((table) => {
					this.#db$.next(table);
				})
			)
			.subscribe();
	}

	public get db(): Table<ENTITY_RAW> {
		const db = this.#db$.value;
		if (!db) {
			throw new Error('Table not initialized');
		}
		return db;
	}

}
