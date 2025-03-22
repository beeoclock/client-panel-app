import {Observable} from "rxjs";

export interface ICreatable<OPTIONS, RETURN> {
	create$(options: OPTIONS): Observable<RETURN>;
	createAsync(options: OPTIONS): Promise<RETURN>;
}
