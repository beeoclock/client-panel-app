import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {Store} from "@ngxs/store";
import {ClientState} from "@client/state/client/client.state";
import {filter, map} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {is} from "thiis";

@Component({
	selector: 'price-and-currency-component',
	standalone: true,
	template: `
		<label default [for]="prefix + 'price'">{{ label }}</label>
		<div class="flex">
			<input
				[id]="prefix + 'price'"
				[formControl]="priceControl"
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
			  [items]="currencyList$ | async"
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
		NgxMaskDirective,
		TranslateModule,
		DefaultLabelDirective,
		AsyncPipe
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceAndCurrencyComponent {

	@Input()
	public prefix = '';

	@Input()
	public label = '';

	@Input()
	public currencyControl = new FormControl();

	@Input()
	public priceControl = new FormControl();

	public readonly translateService = inject(TranslateService);
	private readonly store = inject(Store);

	// public readonly currencyList$ = this.store.select(ClientState.currencies).pipe(
	// 	map((currencies) => {
	// 		if (!currencies) {
	// 			return Object.values(CurrencyCodeEnum);
	// 		}
	// 		return currencies;
	// 	}),
	// 	tap((currencies) => {
	// 		this.updateValue(currencies);
	// 	}),
	// 	map((currencies) => {
	// 		return currencies.map((currency) => ({
	// 			id: currency,
	// 			name: currency
	// 		}));
	// 	}),
	// );

	public readonly currencyList$ = this.store.select(ClientState.baseCurrency).pipe(
		filter(is.not_undefined<CurrencyCodeEnum>),
		map((currency) => {
			const currencies = [currency];
			this.updateValue(currencies);
			return currencies;
		}),
		map((currencies) => {
			return currencies.map((currency) => ({
				id: currency,
				name: currency
			}));
		}),
	);

	private updateValue(currencies: CurrencyCodeEnum[]): void {
		if (!this.currencyControl.value) {
			this.currencyControl.setValue(currencies[0]);
		}
	}

}
