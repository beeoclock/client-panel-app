import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {IListMediaBanner} from "@src/core/business-logic/service/interface/i.media.banner";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class GetBannerServiceApiAdapter extends BaseApiAdapter<IListMediaBanner, [string]> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<IListMediaBanner>(serviceEndpointEnum.getBanners, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
