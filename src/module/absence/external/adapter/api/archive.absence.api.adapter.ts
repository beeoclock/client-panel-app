import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";
import {AbsenceEndpoint} from "@absence/external/endpoint/absence.endpoint";

@Injectable({
  providedIn: 'root'
})
export class ArchiveAbsenceApiAdapter extends BaseApiAdapter<unknown, [string]> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string_not_empty])
  public override execute$(id: string) {
    return this.httpClient.patch(AbsenceEndpoint.ARCHIVE, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
