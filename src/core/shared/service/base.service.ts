import {Table} from "dexie";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {BehaviorSubject, map, Observable} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export abstract class BaseService<ENTITY_RAW> {

	readonly #db$ = new BehaviorSubject<Table<ENTITY_RAW> | undefined>(undefined);

	#repository!: BaseRepository<ENTITY_RAW>;

	public set repository(repository: BaseRepository<ENTITY_RAW>) {
		this.#repository = repository;
	}

	public get repository(): BaseRepository<ENTITY_RAW> {
		if (!this.#repository) {
			throw new Error('Repository not initialized');
		}
		return this.#repository;
	}

	public initDbHandler(): void {

		(this.repository.getDataProvider() as unknown as { db$: Observable<Table<ENTITY_RAW>> })
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
