import {ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {InvalidTooltipDirective} from "@utility/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/directives/has-error/has-error.directive";
import {NgxMaskDirective} from "ngx-mask";
import {TranslateService} from "@ngx-translate/core";
import {LanguageCurrency} from "@utility/domain/const/c.language-currency";

@Component({
  selector: 'price-and-currency-component',
  standalone: true,
  template: `
    <label [for]="prefix + 'price'">Price</label>
    <div class="flex">
      <input
        [id]="prefix + 'price'"
        [formControl]="priceControl"
        mask="separator.2"
        type="text"
        hasError
        invalidTooltip
        placeholder="Write price"
        class="
          rounded-none
          rounded-l
          border
          text-beeColor-900
          focus:ring-blue-500
          focus:border-blue-500
          block
          flex-1
          min-w-0
          w-full
          text-sm
          border-beeColor-300
          py-2
          px-3
          dark:bg-beeDarkColor-700
          dark:border-beeDarkColor-600
          dark:placeholder-beeDarkColor-400
          dark:text-white
          dark:focus:ring-blue-500
          dark:focus:border-blue-500">
      <span
        class="
          inline-flex
          items-center
          text-sm
          text-beeColor-900
          bg-beeColor-200
          border
          border-l-0
          border-beeColor-300
          rounded-r
          dark:bg-beeDarkColor-600
          dark:text-beeDarkColor-400
          dark:border-beeDarkColor-600">
          <ng-select
            style="width: 100px"
            class="border-0"
            bindLabel="name"
            bindValue="id"
            [items]="currencyList"
            [clearable]="false"
            [id]="prefix + 'currency'"
            [formControl]="currencyControl">
          </ng-select>
        </span>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgSelectModule,
    ReactiveFormsModule,
    InvalidTooltipDirective,
    HasErrorDirective,
    NgxMaskDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceAndCurrencyComponent implements OnInit {

  @Input()
  public prefix: string = '';

  @Input()
  public currencyControl = new FormControl();

  @Input()
  public priceControl = new FormControl();

  public readonly translateService = inject(TranslateService);

  public readonly currencyList = Object.values(CurrencyCodeEnum).map((currency) => ({
    id: currency,
    name: currency
  }));

  public ngOnInit(): void {

    this.currencyControl.setValue(LanguageCurrency[this.translateService.currentLang as keyof typeof LanguageCurrency]);

  }

}