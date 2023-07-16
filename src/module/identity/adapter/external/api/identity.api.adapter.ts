import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {identityEndpointEnum} from "@identity/endpoint/identity.endpoint";

@Injectable({
  providedIn: 'root'
})
export class IdentityApiAdapter {

  public readonly http = inject(HttpClient);

  public postCreateUser$(body: any): Observable<unknown> { // TODO interface
    return this.http.post(identityEndpointEnum.postCreateUser, body);
  }

  public postCreateBusinessClient$(body: any): Observable<unknown> { // TODO interface
    return this.http.post(identityEndpointEnum.postCreateBusinessClient, body);
  }

  public postCreateUserAndBusinessClient$(body: any): Observable<unknown> { // TODO interface
    return this.http.post(identityEndpointEnum.postCreateUserAndBusinessClient, body);
  }

  public patchSwitchBusinessClient$(body: { clientId: string }) {
    return this.http.patch(identityEndpointEnum.patchSwitchBusinessClient, body);
  }

}
