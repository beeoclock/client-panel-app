import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {IPatchMediaBanner, RIMediaBanner} from "@service/domain/interface/i.media.banner";

@Injectable({
  providedIn: 'root'
})
export class PatchBannerServiceApiAdapter extends BaseApiAdapter<RIMediaBanner> {


  /**
   * GET ITEM BY ID
   * @param id
   * @param body
   */
  public override execute$(id: string, body: IPatchMediaBanner) {
    return this.httpClient.patch<RIMediaBanner>(serviceEndpointEnum.patchBanners, body, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
