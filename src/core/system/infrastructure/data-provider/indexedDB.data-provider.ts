import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {inject} from "@angular/core";
import {TENANT_ID} from "@src/token";
import {concatMap, filter, from, map, shareReplay, switchMap, take, tap} from "rxjs";
import {is} from "@core/shared/checker";
import Dexie from "dexie";
import {Types} from "@core/shared/types";
import {OrderByEnum, OrderDirEnum} from "@core/shared/enum";
import {IAdapterDataProvider} from "@core/system/interface/data-provider/i.adapter.data-provider";
import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export abstract class IndexedDBDataProvider<ENTITY extends ABaseEntity> extends DataProvider<ENTITY> {

	protected abstract readonly entityFieldsToSearch: string[];

	private readonly tenantId$ = inject(TENANT_ID);

	// TODO: Fix SOLID: Open-Closed Principle
	protected abstract readonly dexieAdapterIndexedDBDataProvider: IAdapterDataProvider<ENTITY>;
	public readonly db$ = this.tenantId$.pipe(
		takeUntilDestroyed(),
		filter(is.string),
		tap((tenant) => {
			this.dexieAdapterIndexedDBDataProvider.prepareTableFor(tenant);
		}),
		map(() => this.dexieAdapterIndexedDBDataProvider.table),
		filter(is.object<Dexie.Table<ENTITY>>),
		shareReplay({bufferSize: 1, refCount: true}),
	);

	/**
	 *
	 * @param entity
	 */
	public override create$(entity: ENTITY) {
		return this.db$.pipe(
			take(1),
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
	 * @param filterFn
	 */
	public override find$(options: Types.FindQueryParams, filterFn = this.defaultFilter.bind(this)) {
		return this.db$.pipe(
			take(1),
			concatMap((table) => {

				const {
					pageSize = undefined,
					page = undefined,
					orderBy = OrderByEnum.CREATED_AT,
					orderDir = OrderDirEnum.DESC,
					...filter
				} = options as Types.StandardQueryParams;

				// Delete updatedSince from filter because it is not a field in the table, and it is not a filter field
				delete filter.updatedSince;

				let query = table.orderBy(orderBy);

				if (orderDir === OrderDirEnum.DESC) {
					query = query.reverse();
				}

				// Filter entities
				query = query.filter((entity) => {
					return filterFn(entity, filter as Types.FindQueryParams);
				});

				const countQuery = query;

				if (pageSize && page) {

					const offset = pageSize * (page - 1);

					query = query.offset(offset).limit(pageSize);

				}

				return from(countQuery.count()).pipe(
					switchMap((totalSize) =>
						from(query.toArray()).pipe(
							map((items) => [totalSize, items] as const)
						)
					),
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
			take(1),
			concatMap((table) => from(table.get(id))),
		);
	}

	/**
	 *
	 * @param entity
	 */
	public override update$(entity: ENTITY) {
		return this.db$.pipe(
			take(1),
			concatMap((table) => {
				entity.refreshUpdatedAt();
				return from(table.where('_id').equals(entity._id).modify((value, ref) => {
					ref.value = entity;
				}));
			}),
			map(() => entity),
		);
	}

	/**
	 *
	 * @param entity
	 */
	public override delete$(entity: ENTITY) {
		return this.db$.pipe(
			take(1),
			concatMap((table) => from(table.delete(entity._id))),
			map(() => true),
		);
	}

	/**
	 * Default filter
	 * @param entity
	 * @param filter
	 * @private
	 */
	public defaultFilter(entity: ENTITY, filter: Types.FindQueryParams) {
		const {phrase, ...otherFilter} = filter as Types.PartialQueryParams;

		const phraseExist = is.string(phrase);
		const filterExist = is.object_not_empty(otherFilter);


		if (!phraseExist && !filterExist) {
			return true;
		}

		const results: boolean[] = [false, false];
		const filterCase: 'every' | 'some' = !!phraseExist && !!filterExist ? 'every' : 'some';

		if (phraseExist) {
			results[0] = this.entityFieldsToSearch.some((field) => {
				return this.regexFullTextSearch(entity, field, phrase);
			});
		}

		if (filterExist) {
			results[1] = Object.entries(otherFilter).every(([key, value]) => {
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


	}

	/**
	 * Search in nested object
	 * @param item
	 * @param path
	 * @param phrase
	 * @private
	 */
	private regexFullTextSearch(item: unknown, path: string, phrase: string): boolean {
		const keys = path.split('.');
		const regex = new RegExp(phrase, 'i'); // case-insensitive

		function searchNested(current: unknown, index: number): boolean {
			if (index === keys.length) {
				if (typeof current === 'string') {
					return regex.test(current);
				}
				return false;
			}

			const key = keys[index];

			if (Array.isArray(current)) {
				return current.some(item => searchNested(item, index));
			} else if (is.object_not_empty<object>(current) && key in current) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				const nextItem = current[key];
				return searchNested(nextItem, index + 1);
			}
			return false;
		}

		return searchNested(item, 0);
	}

}
