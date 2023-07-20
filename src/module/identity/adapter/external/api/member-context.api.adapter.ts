import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {IList} from "@utility/domain/interface/i.endpoint/i.list";
import {IMember} from "@identity/domain/interface/i.member";
import {memberContextEndpointEnum} from "@identity/endpoint/member-context.endpoint";

@Injectable({
  providedIn: 'root'
})
export class MemberContextApiAdapter {

  private readonly http = inject(HttpClient);

  public postRelated$() {
    return this.http.post<IList<IMember>>(memberContextEndpointEnum.postRelated, {
      orderBy: 'createdAt',
      orderDir: 'asc',
      page: 1,
      pageSize: 20
    });
  }

}
