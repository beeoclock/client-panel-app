import {Injectable} from '@angular/core';
import {NotImplementedYetError} from "@utility/domain/error";

@Injectable({
  providedIn: 'root'
})
export class ApiRepository<ITEM> {

  protected path: string | undefined;

  public save(value: ITEM): any {
    throw new NotImplementedYetError();
  }

  public item(id: string): any {
    throw new NotImplementedYetError();
  }

  public remove(id: string): any {
    throw new NotImplementedYetError();
  }

  public list(
    pageSize: number,
    page: number,
    orderBy: string,
    orderDir: string,
    filters: {}
  ): any {
    throw new NotImplementedYetError();
  }

}
