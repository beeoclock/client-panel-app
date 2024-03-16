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
export abstract class BaseApiAdapter<RESPONSE, ARGUMENTS extends readonly unknown[] = []> {

	protected readonly httpClient = inject(HttpClient);

	/**
	 * Stream
	 */
	public abstract execute$(...args: [...ARGUMENTS]): Observable<RESPONSE>;

	/**
	 * Promise
	 * @param args
	 */
	public executeAsync(...args: [...ARGUMENTS]): Promise<RESPONSE> {

		const executing = this.execute$(...args);
		return firstValueFrom(executing);

	}

}
