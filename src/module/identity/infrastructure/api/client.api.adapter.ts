import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {clientEndpointEnum} from "@identity/infrastructure/endpoint/cliet.endpoint";

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
        pageSize: 20
      }
    });
  }

  public postRelated$(): Observable<unknown> {
    return this.http.post(clientEndpointEnum.postRelated, {
      orderBy: 'createdAt',
      orderDir: 'asc',
      page: 1,
      pageSize: 20
    });
  }

}
