import {Observable} from "rxjs";

export interface IDeletable<OPTIONS, RETURN> {
	delete$(options: OPTIONS): Observable<RETURN>;
	deleteAsync(options: OPTIONS): Promise<RETURN>;
}
