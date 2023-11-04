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
export abstract class BaseApiAdapter<RESPONSE, ARGUMENTS extends Array<unknown> = unknown[]> {

	protected readonly httpClient = inject(HttpClient);

	/**
	 * Stream
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public execute$(...args: ARGUMENTS): Observable<RESPONSE> {

		throw new NotImplementedYetError();

	}

	/**
	 * Promise
	 * @param args
	 */
	public executeAsync(...args: ARGUMENTS): Promise<RESPONSE> {

		const executing = this.execute$(...args);
		return firstValueFrom(executing);

	}

}
