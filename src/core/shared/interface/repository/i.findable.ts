import {Observable} from "rxjs";

export interface IFindable<OPTIONS, RETURN> {
    find$(options: OPTIONS): Observable<RETURN>;
    findAsync(options: OPTIONS): Promise<RETURN>;
}
