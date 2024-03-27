import {Component, HostBinding, Input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CurrencyCodeEnum} from "@utility/domain/enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-currencies-business-settings-component',
	template: `
		<label default [for]="id">
			{{ 'client.profile.form.section.businessSettings.select.currencies.label' | translate }}
		</label>
		<div class="text-sm text-beeColor-500">
			{{ 'client.profile.form.section.businessSettings.select.currencies.hint' | translate }}
		</div>
		<ng-select
			[labelForId]="id"
			isRequired
			hasError
			invalidTooltip
			[multiple]="true"
			[items]="currencyList"
			[closeOnSelect]="false"
			[clearable]="false"
			[formControl]="control">
		</ng-select>
	`,
	imports: [
		DefaultLabelDirective,
		NgSelectModule,
		TranslateModule,
		ReactiveFormsModule,
		IsRequiredDirective,
		HasErrorDirective,
		InvalidTooltipDirective
	],
	standalone: true
})
export class CurrenciesBusinessSettingsComponent {

	@Input({required: true})
	public control!: FormControl<CurrencyCodeEnum[]>;

	@Input()
	public id = 'client-business-settings-form-currencies';

	public readonly currencyList = Object.keys(CurrencyCodeEnum);

	@HostBinding()
	public class = 'flex flex-col text-start';

}
