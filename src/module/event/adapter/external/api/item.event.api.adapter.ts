import {Injectable} from '@angular/core';
import * as Event from '@event/domain';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class ItemEventApiAdapter extends BaseApiAdapter<Event.RIEvent, [string]> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Event.RIEvent>(eventEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
