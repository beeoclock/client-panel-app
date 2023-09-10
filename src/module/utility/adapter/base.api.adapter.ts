import {NotImplementedYetError} from "@utility/domain/error";
import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";


export type ResponseListType<ITEM> = {
	items: ITEM[];
	totalSize: number;
};

@Injectable({
	providedIn: 'root'
})
export abstract class BaseApiAdapter<RESPONSE> {

	protected readonly httpClient = inject(HttpClient);

	/**
	 * Stream
	 */
	public execute$(...args: unknown[]): Observable<RESPONSE> {

		throw new NotImplementedYetError();

	}

	/**
	 * Promise
	 * @param args
	 */
	public executeAsync(...args: unknown[]): Promise<RESPONSE> {

		const executing = this.execute$(...args);
		return firstValueFrom(executing);

	}

}
