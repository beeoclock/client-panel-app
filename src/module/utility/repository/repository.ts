import {Injectable} from '@angular/core';
import * as Utility from '@utility/domain';

@Injectable({
  providedIn: 'root'
})
export abstract class Repository {

  public list() {
    throw new Utility.Error.NotImplementedYetError();
  }

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
  public item(id: string) {
    throw new Utility.Error.NotImplementedYetError();
  }

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
  public save(value: unknown) {
    throw new Utility.Error.NotImplementedYetError();
  }

}
