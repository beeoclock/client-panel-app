import {Injectable} from '@angular/core';
import * as Member from '@member/domain';
import {memberEndpointEnum} from "@member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";

@Injectable({
  providedIn: 'root'
})
export class CreateMemberApiAdapter extends BaseApiAdapter<Member.RIMember, [Member.RIMember]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Member.RIMember) {
    return this.httpClient.post<Member.RIMember>(memberEndpointEnum.create, value);
  }

}
