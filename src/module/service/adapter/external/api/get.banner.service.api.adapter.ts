import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {IListMediaBanner} from "@service/domain/interface/i.media.banner";

@Injectable({
  providedIn: 'root'
})
export class GetBannerServiceApiAdapter extends BaseApiAdapter<IListMediaBanner> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<IListMediaBanner>(serviceEndpointEnum.getBanners, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
