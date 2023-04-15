import {Injectable} from '@angular/core';
import {NotImplementedYetError} from '@utility/error/not-implemented-yet.error';

@Injectable({
  providedIn: 'root'
})
export abstract class Repository {

  public list() {
    throw new NotImplementedYetError();
  }

  public item(id: string) {
    throw new NotImplementedYetError();
  }

  public save(value: unknown) {
    throw new NotImplementedYetError();
  }

}
