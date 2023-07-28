import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class ArchiveEventApiAdapter extends BaseApiAdapter<unknown> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.object.not.empty])
  public override execute$({id}: { id: string }) {
    return this.httpClient.patch(eventEndpointEnum.archive, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
