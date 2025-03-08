import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {clientEndpointEnum} from "@src/identity/module/identity/infrastructure/endpoint/cliet.endpoint";

@Injectable({
  providedIn: 'root'
})
export class ClientApiAdapter {

  public readonly http = inject(HttpClient);

  public postPaged$(): Observable<unknown> {
    return this.http.post(clientEndpointEnum.postPaged, {
      params: {
        orderBy: 'createdAt',
        orderDir: 'asc',
        page: 1,
        pageSize: environment.config.pagination.pageSize
      }
    });
  }

  public postRelated$(): Observable<unknown> {
    return this.http.post(clientEndpointEnum.postRelated, {
      orderBy: 'createdAt',
      orderDir: 'asc',
      page: 1,
      pageSize: environment.config.pagination.pageSize
    });
  }

}
