import {Injectable} from '@angular/core';
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@src/core/shared/checker";
import * as Customer from "@src/core/business-logic/customer";

@Injectable({
  providedIn: 'root'
})
export class PostApi extends BaseApiAdapter<Customer.ICustomer.DTO, [Customer.ICustomer.DTO]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Customer.ICustomer.DTO) {
    return this.httpClient.post<Customer.ICustomer.EntityRaw>(customerEndpointEnum.create, value);
  }

}
