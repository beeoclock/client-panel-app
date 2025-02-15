import {Pipe, PipeTransform} from "@angular/core";
import {LanguageCodeEnum, LanguageRecord} from "src/core/shared/enum";

@Pipe({
  standalone: true,
  name: 'language'
})
export class LanguagePipe implements PipeTransform {

  /**
	 * Author: Ivan Karbashevskyi
	 * @param value
	 */
  public transform(value: undefined | keyof typeof LanguageCodeEnum): string {
    if (value) {
      return LanguageRecord[value];
    }
    return 'unknown';
  }

}
