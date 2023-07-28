import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";

@Injectable({
  providedIn: 'root'
})
export class ItemServiceApiAdapter extends BaseApiAdapter<Service.IService> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.post<Service.IService>(serviceEndpointEnum.item, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
