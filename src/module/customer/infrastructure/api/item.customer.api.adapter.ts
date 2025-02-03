import {Injectable} from '@angular/core';
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@utility/adapter/base.api.adapter";
import * as Customer from "@customer/domain";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class ItemCustomerApiAdapter extends BaseApiAdapter<Customer.ICustomer.DTO, [string]> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Customer.ICustomer.Entity>(customerEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
