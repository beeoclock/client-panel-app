import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class ArchiveCustomerApiAdapter extends BaseApiAdapter<unknown> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.string])
  public override execute$(id: string) {
    return this.httpClient.patch(eventEndpointEnum.archive, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
