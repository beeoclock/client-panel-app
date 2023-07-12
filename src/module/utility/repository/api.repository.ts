import {Injectable} from '@angular/core';
import {NotImplementedYetError} from "@utility/domain/error";
import {TableState_BackendFormat} from "@utility/domain/table.state";

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

  public list(params: TableState_BackendFormat): any {
    throw new NotImplementedYetError();
  }

}
