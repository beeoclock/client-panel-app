import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject, Injectable, OnDestroy} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {concatMap, filter, from, map, Subject, tap} from "rxjs";
import {is} from "@core/shared/checker";
import {takeUntil} from "rxjs/operators";
import Dexie from "dexie";
import {Types} from "@core/shared/types";
import {OrderDirEnum} from "@core/shared/enum";
import {IAdapterDataProvider} from "@core/system/interface/data-provider/i.adapter.data-provider";
import {IBaseEntity} from "@utility/domain";
import {IAbsence} from "@core/business-logic/absence/interface/i.absence";

@Injectable()
export abstract class IndexedDBDataProvider<ENTITY extends IBaseEntity> extends DataProvider<ENTITY> implements OnDestroy {

	protected abstract readonly entityFieldsToSearch: string[];

	private readonly destroy$ = new Subject<void>();
	private readonly tenantId$ = inject(TENANT_ID);

	// TODO: Fix SOLID: Open-Closed Principle
	protected abstract readonly dexieAdapterIndexedDBDataProvider: IAdapterDataProvider<IAbsence.Entity>;
	private readonly db$ = this.tenantId$.pipe(
		takeUntil(this.destroy$),
		filter(is.string),
		tap((tenant) => this.dexieAdapterIndexedDBDataProvider.prepareTableFor(tenant)),
		map(() => this.dexieAdapterIndexedDBDataProvider.table),
		filter(is.object<Dexie.Table<ENTITY>>),
	);

	/**
	 *
	 * @param entity
	 */
	public override create$(entity: ENTITY) {
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

				let query = table.orderBy(orderBy);

				if (orderDir === OrderDirEnum.DESC) {
					query = query.reverse();
				}

				const phraseExist = is.string(phrase);
				const filterExist = is.object_not_empty(filter);

				// Filter entities
				query = query.filter((entity) => {

					if (!phraseExist && !filterExist) {
						return true;
					}

					const results: boolean[] = [false, false];
					const filterCase: 'every' | 'some' = !!phraseExist && !!filterExist ? 'every' : 'some';

					if (phraseExist) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-expect-error
						results[0] = this.entityFieldsToSearch.some((field) => phraseRegExp.test(entity[field]));
					}

					if (filterExist) {
						results[1] = Object.entries(filter).every(([key, value]) => {
							if (is.array(value)) {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								return value.includes(entity[key]);
							}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-expect-error
							return entity[key] === value;
						});
					}

					return results[filterCase](is.true);

				});

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
	public override update$(entity: ENTITY) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => from(table.put(entity))),
			tap((result) => console.count(result)),
			map(() => entity),
		);
	}

	/**
	 *
	 * @param entity
	 */
	public override delete$(entity: ENTITY) {
		return this.db$.pipe(
			takeUntil(this.destroy$),
			concatMap((table) => from(table.delete(entity._id))),
			map(() => true),
		);
	}

	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
