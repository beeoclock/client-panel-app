import {inject, Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {customerEndpointEnum} from "@customer/endpoint/customer.endpoint";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerApiAdapter extends ApiRepository<Customer.ICustomer> {

  private readonly httpClient = inject(HttpClient);

  public override list(
    pageSize: number,
    page: number,
    orderBy: string,
    orderDir: string,
    filters: {}
  ): Promise<{
    data: {
      items: Customer.ICustomer[];
      total: number;
    }
  }> {
    console.log(customerEndpointEnum.getCustomer);

    return firstValueFrom(this.httpClient.get<{
      items: Customer.ICustomer[];
      totalSize: number;
    }>(customerEndpointEnum.getCustomer, {
      params: {
        pageSize,
        page,
        orderBy,
        orderDir,
      }
    })).then(({totalSize, items}) => {
      return {
        data: {
          items,
          total: totalSize
        }
      };
    });
  }

}
