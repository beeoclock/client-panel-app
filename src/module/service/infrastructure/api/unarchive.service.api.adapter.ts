import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class UnarchiveServiceApiAdapter extends BaseApiAdapter<unknown, [string]> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string_not_empty])
  public override execute$(id: string) {
    return this.httpClient.patch(serviceEndpointEnum.unarchive, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
