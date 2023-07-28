import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";
import * as Customer from "@customer/domain";

@Injectable({
  providedIn: 'root'
})
export class CreateCustomerApiAdapter extends BaseApiAdapter<Customer.ICustomer> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object.not.empty])
  public override execute$(value: Customer.ICustomer) {
    return this.httpClient.post<Customer.ICustomer>(eventEndpointEnum.create, value);
  }

}
