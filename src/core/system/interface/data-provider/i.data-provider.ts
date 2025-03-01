import {Types} from "@core/shared/types";
import {Observable} from "rxjs";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";

/**
 * Repository Interface
 * @description Interface for Repository
 */
export interface IDataProvider<DTO = unknown, ID_TYPE = string> {

	/**
	 * Find all entities
	 */
	findAsync(options: Types.FindQueryParams): Promise<ResponseListType<DTO>>;

	/**
	 * Find entity by id
	 */
	findByIdAsync(id: ID_TYPE): Promise<DTO | undefined>;

	/**
	 * Create new entity
	 */
	createAsync(dto: DTO): Promise<DTO>;

	/**
	 * Update entity
	 */
	updateAsync(dto: DTO): Promise<DTO>;

	/**
	 * Delete entity
	 */
	deleteAsync(dto: DTO): Promise<boolean>;

	/**
	 * Find dto by options and return observable
	 */
	find$(options: Types.FindQueryParams): Observable<ResponseListType<DTO>>;

	/**
	 * Find entity by id
	 */
	findById$(id: ID_TYPE): Observable<DTO | undefined>;

	/**
	 * Create new entity
	 */
	create$(dto: DTO): Observable<DTO>;

	/**
	 * Update entity
	 */
	update$(dto: DTO): Observable<DTO>;

	/**
	 * Delete entity
	 */
	delete$(dto: DTO): Observable<boolean>;

}
