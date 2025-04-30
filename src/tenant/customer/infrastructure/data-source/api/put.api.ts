import {Injectable} from '@angular/core';
import * as Customer from '@tenant/customer/domain';
import {customerEndpointEnum} from "@tenant/customer/infrastructure/endpoint/customer.endpoint";
import {BaseApiAdapter} from "@core/shared/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@core/shared/checker";
import {HttpContext} from "@angular/common/http";
import {TokensHttpContext} from "@src/tokens.http-context";

@Injectable({
  providedIn: 'root'
})
export class PutApi extends BaseApiAdapter<Customer.ICustomer.DTO, [Customer.ICustomer.DTO]> {

  /**
   * SAVE NEW ITEM OR UPDATE ITEM BY ID
   * @param value
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(value: Customer.ICustomer.DTO) {
    return this.httpClient.put<Customer.ICustomer.EntityRaw>(customerEndpointEnum.update, value, {
			context: new HttpContext().set(TokensHttpContext.REPLACE, {
				id: value._id,
			}),
    });
  }

}
