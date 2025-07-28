import {IDataProvider} from "@core/system/interface/data-provider/i.data-provider";
import {Types} from "@core/shared/types";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {firstValueFrom, Observable} from "rxjs";

export abstract class DataProvider<DTO, ID_TYPE = string> implements IDataProvider<DTO, ID_TYPE> {

	/**
	 *
	 * @param options
	 */
	public findAsync(options: Types.FindQueryParams): Promise<ResponseListType<DTO>> {
		return firstValueFrom(this.find$(options));
	}

	/**
	 *
	 * @param id
	 */
	public findByIdAsync(id: ID_TYPE): Promise<DTO | undefined> {
		return firstValueFrom(this.findById$(id));
	}

	/**
	 *
	 * @param data
	 */
	public createAsync(data: DTO): Promise<DTO> {
		return firstValueFrom(this.create$(data));
	}

	/**
	 *
	 * @param dto
	 */
	public updateAsync(dto: DTO): Promise<DTO> {
		return firstValueFrom(this.update$(dto));
	}

	/**
	 *
	 * @param dto
	 */
	public deleteAsync(dto: DTO): Promise<boolean> {
		return firstValueFrom(this.delete$(dto));
	}

	/**
	 *
	 * @param options
	 * @param filterFunction
	 */
	public find$(options: Types.FindQueryParams = {}, filterFunction?: ((entity: DTO, filter: Types.FindQueryParams) => boolean)): Observable<ResponseListType<DTO>> {
		throw new Error("Method not implemented.");
	}

	/**
	 *
	 * @param id
	 */
	public findById$(id: ID_TYPE): Observable<DTO | undefined> {
		throw new Error("Method not implemented.");
	}

	/**
	 *
	 * @param dto
	 */
	public create$(dto: DTO): Observable<DTO> {
		throw new Error("Method not implemented.");
	}

	/**
	 *
	 * @param dto
	 */
	public update$(dto: DTO): Observable<DTO> {
		throw new Error("Method not implemented.");
	}

	/**
	 *
	 * @param dto
	 */
	public delete$(dto: DTO): Observable<boolean> {
		throw new Error("Method not implemented.");
	}

	public defaultFilter(entity: DTO, filter: Types.FindQueryParams): boolean {
		// Default filter implementation can be overridden in subclasses
		return true; // By default, return true for all entities
	}

}
