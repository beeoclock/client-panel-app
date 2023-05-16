import {Pipe, PipeTransform} from "@angular/core";
import {LanguageCodeEnum, LanguageRecord} from "@utility/domain/enum";

@Pipe({
  standalone: true,
  name: 'language'
})
export class LanguagePipe implements PipeTransform {

  /**
   * Author: Ivan Karbashevskyi
   * @param value
   * @param args
   */
  public transform(value: undefined | keyof typeof LanguageCodeEnum, ...args: unknown[]): string {
    if (value) {
      return LanguageRecord[value];
    }
    return 'unknown';
  }

}
