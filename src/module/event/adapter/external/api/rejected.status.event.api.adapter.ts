import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {IEvent} from "@event/domain";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class RejectedStatusEventApiAdapter extends BaseApiAdapter<IEvent> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string_not_empty])
  public override execute$(id: string) {
    return this.httpClient.patch<IEvent>(eventEndpointEnum.rejected, null, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
