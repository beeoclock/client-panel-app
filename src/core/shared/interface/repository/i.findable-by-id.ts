import {Observable} from "rxjs";

export interface IFindableById<RETURN, ID_TYPE = string> {
	findById$(id: ID_TYPE): Observable<RETURN>;
	findByIdAsync(id: ID_TYPE): Promise<RETURN>;
}
