import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class UpdateMemberApiAdapter extends BaseApiAdapter<Member.IMember> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object.not.empty])
  public override execute$(value: Member.IMember) {
    return this.httpClient.put<Member.IMember>(memberEndpointEnum.update, value, {
      headers: {
        replace: JSON.stringify({
          id: value._id
        })
      }
    });
  }

}