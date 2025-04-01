import {Types} from "@core/shared/types";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {Observable} from "rxjs";

/**
 * Repository Interface
 * @description Interface for Repository
 */
export interface IRepository<ITEM = unknown, ID_TYPE = string> {

	/**
	 * Find all entities
	 */
	findAsync(options: Types.FindQueryParams): Promise<ResponseListType<ITEM>>;

	/**
	 * Find entity by id
	 */
	findByIdAsync(id: ID_TYPE): Promise<ITEM | undefined>;

	/**
	 * Create new entity
	 */
	createAsync(item: ITEM): Promise<ITEM>;

	/**
	 * Update entity
	 */
	updateAsync(item: ITEM): Promise<ITEM>;

	/**
	 * Delete entity
	 */
	deleteAsync(item: ITEM): Promise<boolean>;

	/**
	 * Find item by options and return observable
	 */
	find$(options: Types.FindQueryParams): Observable<ResponseListType<ITEM>>;

	/**
	 * Find entity by id
	 */
	findById$(id: ID_TYPE): Observable<ITEM | undefined>;

	/**
	 * Create new entity
	 */
	create$(item: ITEM): Observable<ITEM>;

	/**
	 * Update entity
	 */
	update$(item: ITEM): Observable<ITEM>;

	/**
	 * Delete entity
	 */
	delete$(item: ITEM): Observable<boolean>;

}
