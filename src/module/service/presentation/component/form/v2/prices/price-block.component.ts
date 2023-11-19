import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {TagsComponent} from "@service/presentation/component/form/v2/details/tags.component";
import {SpecialistsComponent} from "@service/presentation/component/form/v2/prices/specialists.component";
import {PriceAndCurrencyComponent} from "@utility/presentation/component/input/price-and-currency.component";
import {InputBadgeComponent} from "@utility/presentation/component/input/input-badge.component";
import {PriceForm} from "@service/presentation/form/service.form";
import {TimeInputComponent} from "@utility/presentation/component/input/time.input.component";
import {DurationSelectComponent} from "@utility/presentation/component/input/duration.select.component";

@Component({
	selector: 'service-form-price-block-component',
	standalone: true,
	template: `
		<div class="flex flex-col gap-3">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<bee-duration-select-component
					[label]="('keyword.capitalize.duration' | translate) + suffix"
					[control]="durationInSecondsControl"/>
				<price-and-currency-component
					[label]="('keyword.capitalize.price' | translate) + suffix"
					[priceControl]="priceForm.controls.price"
					[currencyControl]="priceForm.controls.currency"/>
			</div>
		</div>
	`,
	imports: [
		NgIf,
		TranslateModule,
		FormInputComponent,
		FormTextareaComponent,
		TagsComponent,
		SpecialistsComponent,
		PriceAndCurrencyComponent,
		InputBadgeComponent,
		TimeInputComponent,
		DurationSelectComponent,
	]
})
export class PriceBlockComponent {

	@Input()
	public durationInSecondsControl = new FormControl();

	@Input()
	public priceForm = new PriceForm();

	@Input()
	public suffix = '';
}
