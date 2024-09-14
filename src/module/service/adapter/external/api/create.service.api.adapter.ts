import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";
import {IServiceDto} from "@order/external/interface/i.service.dto";

@Injectable({
  providedIn: 'root'
})
export class CreateServiceApiAdapter extends BaseApiAdapter<IServiceDto, [IServiceDto]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: IServiceDto) {
    return this.httpClient.post<IServiceDto>(serviceEndpointEnum.create, value);
  }

}
