import {inject, LOCALE_ID, Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "currencyCode",
  standalone: true
})
export class CurrencyCodePipe implements PipeTransform {

  /**
   * It is a USER language not country!!!
   * @private
   */
  readonly #localId = inject(LOCALE_ID);

  public transform(currency: string, options: Intl.NumberFormatOptions = {}): string {
    const parts = new Intl.NumberFormat(
      this.#localId,
      {
        ...options,
        style: 'currency',
        currency
      }
    ).formatToParts();

    const {value: symbol = ''} = parts.find(part => part.type === 'currency') ?? {};
    return symbol;
  }

}
