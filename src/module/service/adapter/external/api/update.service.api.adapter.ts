import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class UpdateServiceApiAdapter extends BaseApiAdapter<Service.IService> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Service.IService) {
    return this.httpClient.put<Service.IService>(serviceEndpointEnum.update, value, {
      headers: {
        replace: JSON.stringify({
          id: value._id
        })
      }
    });
  }

}
