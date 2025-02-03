import {Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {customerEndpointEnum} from "@customer/infrastructure/endpoint/customer.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "@utility/checker";

@Injectable({
  providedIn: 'root'
})
export class ListCustomerApiAdapter extends BaseApiAdapter<ResponseListType<Customer.ICustomer.Entity>, [TableState_BackendFormat]> {


  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(params: TableState_BackendFormat) {
    return this.httpClient.get<ResponseListType<Customer.ICustomer.Entity>>(customerEndpointEnum.paged, {
			params: params as never,
		});
  }

}
