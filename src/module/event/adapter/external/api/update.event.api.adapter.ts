import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class UpdateEventApiAdapter extends BaseApiAdapter<Event.IEvent> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Event.IEvent) {
    return this.httpClient.put<Event.IEvent>(eventEndpointEnum.update, value, {
      headers: {
        replace: JSON.stringify({
          id: value._id
        })
      }
    });
  }

}
