import {Pipe, PipeTransform} from '@angular/core';
import {getFirstKey} from '@utility/first-key-name.tool';

@Pipe({
  name: 'firstKeyName'
})
export class FirstKeyNamePipe implements PipeTransform {

  /**
   * Author: Ivan Karbashevskyi
   * @param value
   * @param args
   */
  public transform(value: any, ...args: unknown[]): string {
    return getFirstKey(value);
  }

}
