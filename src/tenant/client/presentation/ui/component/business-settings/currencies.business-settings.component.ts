import {Component, HostBinding, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CurrencyCodeEnum} from "@core/shared/enum";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";
import {HasErrorDirective} from "@shared/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";

@Component({
	selector: 'client-currencies-business-settings-component',
	template: `
		<div class="relative">
			<label default [for]="id()">
				{{ 'client.profile.form.section.businessSettings.select.currencies.label' | translate }}
			</label>
			<ng-select
				[labelForId]="id()"
				isRequired
				hasError
				invalidTooltip
				[multiple]="true"
				[items]="currencyList"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.businessSettings.select.currencies.hint' | translate }}
		</div>
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

	public readonly control = input.required<FormControl<CurrencyCodeEnum[]>>();

	public readonly id = input('client-business-settings-form-currencies');

	public readonly currencyList = Object.keys(CurrencyCodeEnum);

	@HostBinding()
	public class = 'flex flex-col text-start';

}
