import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation,
  input
} from "@angular/core";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
	selector: 'price-and-currency-component',
	standalone: true,
	template: `
		<label default [for]="prefix() + 'price'">{{ label() }}</label>
		<div class="flex">
			<input
				[id]="prefix() + 'price'"
				[formControl]="priceControl()"
				mask="separator.2"
				type="text"
				hasError
				invalidTooltip
				[placeholder]="'keyword.capitalize.writePrice' | translate"
				class="
          rounded-none
          rounded-l
          border
          shadow-sm
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
          shadow-sm
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
			  [items]="currencyList()"
			  [clearable]="false"
			  [id]="prefix() + 'currency'"
			  [formControl]="currencyControl()">
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
		NgxMaskDirective,
		TranslateModule,
		DefaultLabelDirective,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceAndCurrencyComponent implements OnChanges {

	public readonly prefix = input('');

	public readonly label = input('');

	public readonly currencyList = input.required<{
    id: CurrencyCodeEnum;
    name: CurrencyCodeEnum;
}[]>();

	public readonly currencyControl = input(new FormControl());

	public readonly priceControl = input(new FormControl());

	public readonly translateService = inject(TranslateService);

	public ngOnChanges(changes: SimpleChanges & { currencyList: SimpleChange }) {
		if (changes.currencyList) {
			this.updateValue(changes.currencyList.currentValue);
		}
	}

	private updateValue(currencies: { id: CurrencyCodeEnum; name: CurrencyCodeEnum; }[]): void {
		const currencyControl = this.currencyControl();
  if (!currencyControl.value) {
			currencyControl.setValue(currencies[0].id);
		}
	}

}
