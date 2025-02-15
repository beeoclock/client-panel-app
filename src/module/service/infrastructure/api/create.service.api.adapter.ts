import {Injectable} from '@angular/core';
import {serviceEndpointEnum} from "@service/infrastructure/endpoint/service.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import {IServiceDto} from "@src/core/business-logic/order/interface/i.service.dto";

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
