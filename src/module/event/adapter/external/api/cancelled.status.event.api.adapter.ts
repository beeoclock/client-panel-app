import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import {IEvent} from "@event/domain";

@Injectable({
  providedIn: 'root'
})
export class CancelledStatusEventApiAdapter extends BaseApiAdapter<IEvent> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string.not.empty])
  public override execute$(id: string) {
    return this.httpClient.patch<IEvent>(eventEndpointEnum.cancelled, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
