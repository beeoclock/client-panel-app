import {Component, input} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {FormControl} from "@angular/forms";
import {PriceAndCurrencyComponent} from "@shared/presentation/component/input/price-and-currency.component";
import {PriceForm} from "@tenant/service/presentation/form/service.form";
import {DurationSelectComponent} from "@shared/presentation/component/input/duration.select.component";
import {CurrencyCodeEnum} from "@core/shared/enum";

@Component({
	selector: 'service-form-price-block-component',
	standalone: true,
	template: `
		<div class="flex flex-col gap-3">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<bee-duration-select-component
					[label]="('keyword.capitalize.duration' | translate) + suffix()"
					[control]="durationInSecondsControl()"/>
				<price-and-currency-component
					[label]="('keyword.capitalize.price' | translate) + suffix()"
					[currencyList]="currencyList()"
					[priceControl]="priceForm().controls.price"
					[currencyControl]="priceForm().controls.currency"/>
			</div>
		</div>
	`,
	imports: [
		TranslateModule,
		PriceAndCurrencyComponent,
		DurationSelectComponent,
	]
})
export class PriceBlockComponent {

	public readonly durationInSecondsControl = input(new FormControl());

	public readonly priceForm = input(new PriceForm());

	public readonly suffix = input('');

	public readonly currencyList = input.required<{
    id: CurrencyCodeEnum;
    name: CurrencyCodeEnum;
}[]>();
}
