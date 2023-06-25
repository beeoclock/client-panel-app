import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {memberEndpointEnum} from "@identity/endpoint/member.endpoint";

@Injectable()
export class MemberApiAdapter {

  public readonly http = inject(HttpClient);

  /**
   * Return list of user's members, that means if user (not guest) do request by endpoint
   * he/she will receive him/her information about members at business clients
   *
   * User A is a member at Business Client X
   * User B is a member at Business Client X
   *
   * User A is a member at Business Client Y
   *
   * User B is a member at Business Client Z
   *
   */
  public getMembers$(): Observable<unknown> {
    return this.http.get(memberEndpointEnum.getMembers);
  }

}
