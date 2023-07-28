import {Injectable} from '@angular/core';
import {memberEndpointEnum} from "@member/endpoint/member.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class ArchiveMemberApiAdapter extends BaseApiAdapter<unknown> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.patch(memberEndpointEnum.archive, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
