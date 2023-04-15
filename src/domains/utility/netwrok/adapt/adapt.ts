import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class Adapt {

  public list() {
    throw new Error('Not implemented yet!');
  }

  public item(id: string) {
    throw new Error('Not implemented yet!');
  }

  public save(value: unknown) {
    throw new Error('Not implemented yet!');
  }

  public update(id: string, value: unknown) {
    throw new Error('Not implemented yet!');
  }

}
