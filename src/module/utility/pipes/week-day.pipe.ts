import {Pipe, PipeTransform} from "@angular/core";
import {WEEK_DAYS_NAME} from "@utility/domain/enum";

@Pipe({
  standalone: true,
  name: 'weekDay'
})
export class WeekDayPipe implements PipeTransform {

  /**
   * Author: Ivan Karbashevskyi
   * @param value
   * @param args
   */
  public transform(value: undefined | number, ...args: unknown[]): string {
    if (value) {
      return WEEK_DAYS_NAME[value];
    }
    return 'unknown';
  }

}
