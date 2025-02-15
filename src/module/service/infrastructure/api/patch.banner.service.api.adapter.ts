import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {RIMediaBanner} from "@src/core/business-logic/service/interface/i.media.banner";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class PatchBannerServiceApiAdapter extends BaseApiAdapter<RIMediaBanner, [string, FormData]> {

  /**
   * GET ITEM BY ID
   * @param id
   * @param body
   */
  public override execute$(id: string, body: FormData) {
    return this.httpClient.patch<RIMediaBanner>(serviceEndpointEnum.patchBanners, body, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
