import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ItemEventApiAdapter extends BaseApiAdapter<Event.IEvent> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.post<Event.IEvent>(eventEndpointEnum.item, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
