import {Duration} from "luxon";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ConvertTime {

  export function calculateDuration(...args: Duration[]): Duration {

    return args.reduce((previousValue, currentValue) => {
      return previousValue.plus(currentValue);
    }, Duration.fromISOTime('00:00:00'));

  }

  /**
   * Input to input
   * @param value
   */
  // public convertIn(value: number): string {
  //   return DateTime.now().set({second: 0, minute: 0, hour: 0}).set({second: value}).toFormat('HH:mm:ss');
  // }

  /**
   * Output from input
   * @param value
   */
  // public convertOut(value: string): number {
  //   return DateTime.fromFormat(value, 'HH:mm:ss').diff(
  //     DateTime.fromFormat('00:00:00', 'HH:mm:ss')
  //   ).as('seconds');
  // }

}
