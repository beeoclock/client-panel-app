import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {IList} from "@utility/domain/interface/i.endpoint/i.list";
import {IMember} from "@identity/domain/interface/i.member";
import {memberContextEndpointEnum} from "@identity/infrastructure/endpoint/member-context.endpoint";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class MemberContextApiAdapter {

  private readonly http = inject(HttpClient);

  public related$() {
    return this.http.get<IList<IMember>>(memberContextEndpointEnum.related, {
      params: {
				orderBy: 'createdAt',
				orderDir: 'asc',
				page: 1,
				pageSize: 20
			}
    });
  }

  /**
   *
   * @param id
   */
  public deleteBusinessClient(id: string) {
    return this.http.delete(memberContextEndpointEnum.deleteBusinessClientById, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
