import {inject, Injectable} from '@angular/core';
import * as Customer from '@customer/domain';
import {ICustomer} from '@customer/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {customerEndpointEnum} from "@customer/endpoint/customer.endpoint";
import {firstValueFrom} from "rxjs";
import {TableState_BackendFormat} from "@utility/domain/table.state";

@Injectable({
  providedIn: 'root'
})
export class CustomerApiAdapter extends ApiRepository<Customer.ICustomer> {

  private readonly httpClient = inject(HttpClient);

  public override list(params: TableState_BackendFormat): Promise<{
    data: {
      items: Customer.ICustomer[];
      total: number;
    }
  }> {
    return firstValueFrom(this.httpClient.post<{
      items: Customer.ICustomer[];
      totalSize: number;
    }>(customerEndpointEnum.paged, params)).then(({totalSize, items}) => {
      return {
        data: {
          items,
          total: totalSize
        }
      };
    });
  }

  public override item(id: string): Promise<{
    data: Customer.ICustomer
  }> {
    return firstValueFrom(this.httpClient.post<Customer.ICustomer>(customerEndpointEnum.item, null, {
      headers: {
        replace: JSON.stringify({
          id
        })
      }
    })).then((data) => {
      return {
        data
      };
    });
  }

  public override save(value: Customer.ICustomer): Promise<ICustomer> {
    if (value?._id?.length) {
      return firstValueFrom(this.httpClient.put<ICustomer>(customerEndpointEnum.update, value, {
        headers: {
          replace: JSON.stringify({
            id: value._id
          })
        }
      }));
    } else {
      return firstValueFrom(this.httpClient.post<ICustomer>(customerEndpointEnum.create, value));
    }
  }

}
