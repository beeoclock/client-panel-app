import {IAbsence} from "@core/business-logic/absence/interface/i.absence";
import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable, OnDestroy} from "@angular/core";
import {
	DexieAdapterIndexedDBDataProvider
} from "@absence/infrastructure/data-provider/indexedDB/adapter/dexie.adapter.indexedDB.data-provider";
import {TENANT_ID} from "@src/token";
import {concatMap, filter, from, map, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import Dexie from "dexie";
import {Types} from "@core/shared/types";
import {OrderDirEnum} from "@core/shared/enum";

@Injectable()
export class IndexedDBDataProvider extends DataProvider<IAbsence.Entity> implements OnDestroy {

	private readonly destroy$ = new Subject<void>();
	private readonly tenantId$ = inject(TENANT_ID);

	// TODO: Fix SOLID: Open-Closed Principle
	private readonly dexieAdapterIndexedDBDataProvider = inject(DexieAdapterIndexedDBDataProvider);
	private readonly db$ = this.tenantId$.pipe(
		takeUntil(this.destroy$),
		tap((tenant) => {
			console.log('IndexedDBDataProvider:tenant', {tenant});
		}),
		filter(is.string),
		tap((tenant) => this.dexieAdapterIndexedDBDataProvider.prepareTableFor(tenant)),
		map(() => this.dexieAdapterIndexedDBDataProvider.table),
		filter(is.object<Dexie.Table<IAbsence.Entity>>),
	);

	constructor() {
		super();
		console.log('IndexedDBDataProvider:constructor');
	}

	/**
	 *
	 * @param entity
	 */
	public override create$(entity: IAbsence.Entity) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) =>
				from(table.add(entity)).pipe(
					map(() => entity)
				)
			),
		);
	}

	/**
	 *
	 * @param options
	 */
	public override find$(options: Types.FindQueryParams) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => {

				const {pageSize, page, orderBy, orderDir, phrase, ...filter} = options as Types.StandardQueryParams;

				// Delete updatedSince from filter because it is not a field in the table, and it is not a filter field
				delete filter.updatedSince;

				const offset = pageSize * (page - 1);
				const phraseRegExp = new RegExp(phrase ?? '', 'i');
				const entityFieldsToSearch: (keyof IAbsence.Entity)[] = ['note'];

				// TODO: Check if orderBy is works!
				let query = table.orderBy(orderBy);

				// TODO: Check if orderDir is works!
				if (orderDir === OrderDirEnum.DESC) {
					query = query.reverse();
				}

				const phraseExist = is.string(phrase);
				const filterExist = is.object_not_empty(filter);

				// Filter entities
				query = query.filter((entity) => (
					( // Search phrase in entity fields
						phraseExist &&
						entityFieldsToSearch.some((field) => phraseRegExp.test(entity[field]))
					) || ( // Filter entity by filter fields
						filterExist &&
						Object.entries(filter).every(([key, value]) => {
							if (is.array(value)) {
								return value.includes(entity[key]);
							}
							return entity[key] === value;
						})
					)
				));

				const promiseAll = Promise.all([
					query.count(),
					query.offset(offset).limit(pageSize).toArray(),
				]);

				return from(promiseAll).pipe(
					map(({0: totalSize, 1: items}) => ({
						items,
						totalSize,
					}))
				);
			}),
		);
	}

	/**
	 *
	 * @param id
	 */
	public override findById$(id: string) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => from(table.get(id))),
		);
	}

	/**
	 *
	 * @param entity
	 */
	public override update$(entity: IAbsence.Entity) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => from(table.update(entity.id, entity))),
			map(() => entity),
		);
	}

	/**
	 *
	 * @param entity
	 */
	public override delete$(entity: IAbsence.Entity) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => from(table.delete(entity.id))),
			map(() => true),
		);
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
