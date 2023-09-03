import {Injectable} from '@angular/core';
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {mediaEndpointEnum} from "@module/media/endpoint/media.endpoint";
import {IMedia} from "@module/media/domain/interface/i.media";

@Injectable({
  providedIn: 'root'
})
export class ItemMediaApiAdapter extends BaseApiAdapter<IMedia> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<IMedia>(mediaEndpointEnum.item, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
