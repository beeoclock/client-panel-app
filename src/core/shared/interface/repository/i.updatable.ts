import {Observable} from "rxjs";

export interface IUpdatable<OPTIONS, RETURN> {
	update$(options: OPTIONS): Observable<RETURN>;
	updateAsync(options: OPTIONS): Promise<RETURN>;
}
