import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class ItemServiceApiAdapter extends BaseApiAdapter<Service.IService, [string]> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Service.IService>(serviceEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
