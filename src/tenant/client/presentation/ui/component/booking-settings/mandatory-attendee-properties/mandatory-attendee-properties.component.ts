import {Component, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {Reactive} from "@core/cdk/reactive";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {HasErrorDirective} from "@shared/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
	selector: 'client-booking-settings-mandatory-attendee-properties-component',
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
			<label default for="client-booking-settings-form-mandatory-attendee-properties">
				{{ 'client.profile.form.section.bookingSettings.select.mandatoryAttendeeProperties.label' | translate }}
			</label>
			<ng-select
				labelForId="client-booking-settings-form-mandatory-attendee-properties"
				bindLabel="label"
				bindValue="value"
				isRequired
				hasError
				invalidTooltip
				[placeholder]="'keyword.capitalize.notSpecified' | translate"
				[multiple]="true"
				[items]="items"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.select.mandatoryAttendeeProperties.hint' | translate }}
		</div>
	`
})
export class MandatoryAttendeePropertiesComponent extends Reactive implements OnInit {

	public readonly control = input.required<FormControl<string[]>>();

	private readonly translateService = inject(TranslateService);

	public items: { value: string; label: string; }[] = [];

	ngOnInit(): void {
		this.initItems();
		this.translateService.onLangChange.pipe(this.takeUntil()).subscribe(() => {
			this.initItems();
		});
	}

	public initItems(): void {
		this.items = [
			{
				value: 'email',
				label: this.translateService.instant('mandatoryAttendeeProperties.options.email'),
			},
			{
				value: 'phone',
				label: this.translateService.instant('mandatoryAttendeeProperties.options.phone'),
			},
			{
				value: 'firstName',
				label: this.translateService.instant('mandatoryAttendeeProperties.options.firstName'),
			}
		];
	}


}
