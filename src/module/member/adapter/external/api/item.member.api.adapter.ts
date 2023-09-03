import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ItemMemberApiAdapter extends BaseApiAdapter<Member.IMember> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Member.IMember>(memberEndpointEnum.item, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
