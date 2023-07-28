import {Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class CreateServiceApiAdapter extends BaseApiAdapter<Service.IService> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object.not.empty])
  public override execute$(value: Service.IService) {
    return this.httpClient.post<Service.IService>(serviceEndpointEnum.create, value);
  }

}
