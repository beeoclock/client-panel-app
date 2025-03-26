import {Injectable} from '@angular/core';
import {customerEndpointEnum} from "@[tenant]/customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import * as Customer from "@core/business-logic/customer";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class GetItemApi extends BaseApiAdapter<Customer.ICustomer.DTO, [string]> {


  /**
   * GET ITEM BY ID
   * @param id
   */
  public override execute$(id: string) {
    return this.httpClient.get<Customer.ICustomer.EntityRaw>(customerEndpointEnum.item, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id
			}),
    });
  }

}
