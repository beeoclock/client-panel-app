import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class DeleteBannerServiceApiAdapter extends BaseApiAdapter<unknown> {


  /**
   * GET ITEM BY ID
   * @param serviceId
   * @param id
   */
  public override execute$(serviceId: string, id: string) {
    return this.httpClient.delete<unknown>(serviceEndpointEnum.deleteBanners, {
      headers: {
        replace: JSON.stringify({
          id,
          serviceId
        })
      }
    });
  }

}
