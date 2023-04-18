import {Injectable} from '@angular/core';
import * as Utility from '@utility/domain';

@Injectable({
  providedIn: 'root'
})
export abstract class Repository {

  public list() {
    throw new Utility.Error.NotImplementedYetError();
  }

  public item(id: string) {
    throw new Utility.Error.NotImplementedYetError();
  }

  public save(value: unknown) {
    throw new Utility.Error.NotImplementedYetError();
  }

}
