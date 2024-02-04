import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class ItemMemberApiAdapter extends BaseApiAdapter<Member.RIMember> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Member.RIMember>(memberEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
