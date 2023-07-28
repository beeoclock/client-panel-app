import {Injectable} from '@angular/core';
import {eventEndpointEnum} from "@event/endpoint/event.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Customer from "@customer/domain";

@Injectable({
  providedIn: 'root'
})
export class ItemCustomerApiAdapter extends BaseApiAdapter<Customer.ICustomer> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.post<Customer.ICustomer>(eventEndpointEnum.item, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    });
  }

}
