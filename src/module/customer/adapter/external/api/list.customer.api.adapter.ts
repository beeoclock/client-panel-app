import {Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {customerEndpointEnum} from "@customer/endpoint/customer.endpoint";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {BaseApiAdapter, ResponseListType} from "@utility/adapter/base.api.adapter";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {is} from "thiis";

@Injectable({
  providedIn: 'root'
})
export class ListCustomerApiAdapter extends BaseApiAdapter<ResponseListType<Customer.ICustomer>> {


  /**
   * GET PAGED LIST BY FILTERS AND PARAMS
   * @param params
   */
  @TypeGuard([is.object_not_empty])
  public override execute$(params: TableState_BackendFormat) {
    return this.httpClient.get<ResponseListType<Customer.ICustomer>>(customerEndpointEnum.paged, {
			params: params as never,
		});
  }

}
