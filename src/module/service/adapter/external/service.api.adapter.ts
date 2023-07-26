import {inject, Injectable} from '@angular/core';
import * as Service from '@service/domain';
import {ApiRepository} from "@utility/repository/api.repository";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {TableState_BackendFormat} from "@utility/domain/table.state";
import {serviceEndpointEnum} from "@service/endpoint/service.endpoint";

@Injectable({
  providedIn: 'root'
})
export class ServiceApiAdapter extends ApiRepository<Service.IService> {

  private readonly httpClient = inject(HttpClient);

  /**
   *
   * @param params
   */
  public override list(params: TableState_BackendFormat): Promise<{
    data: {
      items: Service.IService[];
      total: number;
    }
  }> {
    return firstValueFrom(this.httpClient.post<{
      items: Service.IService[];
      totalSize: number;
    }>(serviceEndpointEnum.paged, params)).then(({totalSize, items}) => {
      return {
        data: {
          items,
          total: totalSize
        }
      };
    });
  }

  /**
   *
   * @param id
   */
  public override item(id: string): Promise<{
    data: Service.IService
  }> {
    return firstValueFrom(this.httpClient.post<Service.IService>(serviceEndpointEnum.item, null, {
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

  /**
   *
   * @param value
   */
  public override save(value: Service.IService): Promise<Service.IService> {
    if (value?._id?.length) {
      return firstValueFrom(this.httpClient.put<Service.IService>(serviceEndpointEnum.update, value, {
        headers: {
          replace: JSON.stringify({
            id: value._id
          })
        }
      }));
    } else {
      return firstValueFrom(this.httpClient.post<Service.IService>(serviceEndpointEnum.create, value));
    }
  }

}
