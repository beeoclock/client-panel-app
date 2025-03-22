import {Observable} from "rxjs";

export interface ICancelable<OPTIONS, RETURN> {
	cancel$(options: OPTIONS): Observable<RETURN>;
	cancelAsync(options: OPTIONS): Promise<RETURN>;
}
