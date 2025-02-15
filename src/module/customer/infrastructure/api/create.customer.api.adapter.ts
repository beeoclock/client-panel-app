import {Injectable} from '@angular/core';
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "../../../../../core/shared/checker";
import * as Customer from "../../../../../core/business-logic/customer";

@Injectable({
  providedIn: 'root'
})
export class CreateCustomerApiAdapter extends BaseApiAdapter<Customer.ICustomer.DTO, [Customer.ICustomer.DTO]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Customer.ICustomer.DTO) {
    return this.httpClient.post<Customer.ICustomer.Entity>(customerEndpointEnum.create, value);
  }

}
