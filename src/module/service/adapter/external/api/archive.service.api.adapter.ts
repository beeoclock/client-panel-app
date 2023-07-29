import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class ArchiveServiceApiAdapter extends BaseApiAdapter<unknown> {

  /**
   * ARCHIVE ITEM BY ID
   * @param id
   */
  @TypeGuard([is.object.not.empty])
  public override execute$({id}: { id: string }) {
    return this.httpClient.patch(serviceEndpointEnum.archive, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
