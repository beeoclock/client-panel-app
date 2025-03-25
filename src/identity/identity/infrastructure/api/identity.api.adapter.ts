import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {identityEndpointEnum} from "@identity/identity/infrastructure/endpoint/identity.endpoint";
import {IBusinessClient} from "@identity/identity/domain/interface/RIBusinessClient";

@Injectable({
	providedIn: 'root'
})
export class IdentityApiAdapter {

	public readonly http = inject(HttpClient);

	/**
	 *
	 * @param body
	 */
	public postCreateUser$(body: any): Observable<unknown> { // TODO interface
		return this.http.post(identityEndpointEnum.postCreateUser, body);
	}

	/**
	 *
	 * @param body
	 */
	public postCreateBusinessClient$(body: IBusinessClient) {
		return this.http.post<{ id: string }>(identityEndpointEnum.postCreateBusinessClient, body);
	}

	/**
	 *
	 * @param body
	 */
	public postCreateUserAndBusinessClient$(body: any): Observable<unknown> { // TODO interface
		return this.http.post(identityEndpointEnum.postCreateUserAndBusinessClient, body);
	}

}
