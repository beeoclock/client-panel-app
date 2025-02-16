import {Injectable} from "@angular/core";
import {Table} from "dexie";
import {firstValueFrom, Observable} from "rxjs";
import {BaseRepository} from "@core/system/infrastructure/repository/base.repository";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

type ENTITY = IAbsence.Entity;

@Injectable()
export class AbsenceService {

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

	/**
	 * Find all absences by range
	 * @param start
	 * @param end
	 */
	public async findByRange(start: string, end: string) {
		// TODO take only state === 'active'
		return this.db.filter(record =>
			(record.start >= start && record.start < end) ||
			(record.end > start && record.end <= end) ||
			(record.start < start && record.end > end)
		).toArray();
	}
}
