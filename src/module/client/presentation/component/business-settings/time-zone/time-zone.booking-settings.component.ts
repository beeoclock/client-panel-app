import {Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Reactive} from "@utility/cdk/reactive";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";
import {HasErrorDirective} from "@utility/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@utility/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {IsRequiredDirective} from "@utility/presentation/directives/is-required/is-required";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
	selector: 'client-booking-settings-time-zone-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DefaultLabelDirective,
		HasErrorDirective,
		InvalidTooltipDirective,
		IsRequiredDirective,
		NgSelectModule,
		TranslateModule,
		ReactiveFormsModule
	],
	template: `
		<div class="relative">
			<label default for="client-booking-settings-form-time-zone">
				{{ 'client.profile.form.section.bookingSettings.select.timeZone.label' | translate }}
			</label>
			<ng-select
				labelForId="client-booking-settings-form-time-zone"
				bindLabel="label"
				bindValue="value"
				isRequired
				hasError
				invalidTooltip
				[placeholder]="'keyword.capitalize.notSpecified' | translate"
				[multiple]="false"
				[items]="items"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight text-start p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.select.timeZone.hint' | translate }}
		</div>
	`
})
export class TimeZoneBookingSettingsComponent extends Reactive implements OnInit {

	public readonly control = input.required<FormControl<string>>();

	private readonly translateService = inject(TranslateService);

	public items: { value: string; label: string; }[] = [];

	ngOnInit(): void {
		this.initItems();
		this.translateService.onLangChange.pipe(this.takeUntil()).subscribe(() => {
			this.initItems();
		});
	}

	public initItems(): void {
		this.items = this.getTimeZoneList().map((timeZone) => {
			return {
				value: timeZone,
				label: timeZone,
			};
		});
	}

	private getTimeZoneList() {
		return Intl.supportedValuesOf('timeZone');
	}


}
