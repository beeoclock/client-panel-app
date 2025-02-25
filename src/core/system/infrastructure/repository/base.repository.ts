import {IRepository} from "@core/system/interface/i.repository";
import {DataProvider} from "@core/system/infrastructure/data-provider/data-provider";
import {ResponseListType} from "@core/shared/adapter/base.api.adapter";
import {Types} from "@core/shared/types";
import {firstValueFrom, Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export abstract class BaseRepository<ITEM, ID_TYPE = string> implements IRepository<ITEM, ID_TYPE> {

	constructor(
		public readonly dataProvider: DataProvider<ITEM, ID_TYPE>
	) {
	}

	/**
	 *
	 * @param options
	 */
	public findAsync(options: Types.FindQueryParams): Promise<ResponseListType<ITEM>> {
		return firstValueFrom(this.find$(options));
	}

	/**
	 *
	 * @param id
	 */
	public findByIdAsync(id: ID_TYPE): Promise<ITEM | undefined> {
		return firstValueFrom(this.findById$(id));
	}

	/**
	 *
	 * @param data
	 */
	public createAsync(data: ITEM): Promise<ITEM> {
		return firstValueFrom(this.create$(data));
	}

	/**
	 *
	 * @param item
	 */
	public updateAsync(item: ITEM): Promise<ITEM> {
		return firstValueFrom(this.update$(item));
	}

	/**
	 *
	 * @param item
	 */
	public deleteAsync(item: ITEM): Promise<boolean> {
		return firstValueFrom(this.delete$(item));
	}

	/**
	 *
	 * @param options
	 */
	public find$(options: Types.FindQueryParams): Observable<ResponseListType<ITEM>> {
		return this.dataProvider.find$(options);
	}

	/**
	 *
	 * @param id
	 */
	public findById$(id: ID_TYPE): Observable<ITEM | undefined> {
		return this.dataProvider.findById$(id);
	}

	/**
	 *
	 * @param item
	 */
	public create$(item: ITEM): Observable<ITEM> {
		return this.dataProvider.create$(item);
	}

	/**
	 *
	 * @param item
	 */
	public update$(item: ITEM): Observable<ITEM> {
		return this.dataProvider.update$(item);
	}

	/**
	 *
	 * @param item
	 */
	public delete$(item: ITEM): Observable<boolean> {
		return this.dataProvider.delete$(item);
	}

}
