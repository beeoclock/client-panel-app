import {Injectable} from '@angular/core';
import {memberEndpointEnum} from "@member/infrastructure/endpoint/member.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IMember} from "@src/core/business-logic/member/interface/i.member";

@Injectable()
export class PostApi extends BaseApiAdapter<IMember.DTO, [IMember.DTO]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: IMember.DTO) {
    return this.httpClient.post<IMember.DTO>(memberEndpointEnum.create, value);
  }

}
