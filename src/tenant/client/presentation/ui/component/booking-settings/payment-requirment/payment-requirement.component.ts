import {Component, DestroyRef, inject, input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {HasErrorDirective} from "@shared/presentation/directives/has-error/has-error.directive";
import {InvalidTooltipDirective} from "@shared/presentation/directives/invalid-tooltip/invalid-tooltip.directive";
import {IsRequiredDirective} from "@shared/presentation/directives/is-required/is-required";
import {NgSelectModule} from "@ng-select/ng-select";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {PaymentRequirementEnum} from "@identity/identity/domain/enum/payment-requirement.enum";

@Component({
	selector: 'client-booking-settings-payment-requirement-component',
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
				{{ 'client.profile.form.section.bookingSettings.select.paymentRequirement.label' | translate }}
			</label>
			<ng-select labelForId="client-booking-settings-form-mandatory-attendee-properties"
				bindLabel="label"
				bindValue="value"
				isRequired
				hasError
				invalidTooltip
				[placeholder]="'keyword.capitalize.notSpecified' | translate"
				[items]="items"
				[closeOnSelect]="false"
				[clearable]="false"
				[formControl]="control()" />
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.select.paymentRequirement.hint' | translate }}
		</div>
	`
})
export class PaymentRequirementComponent implements OnInit {

	public readonly control = input.required<FormControl<PaymentRequirementEnum>>();

	private readonly translateService = inject(TranslateService);
	private readonly destroyRef = inject(DestroyRef);

	public items: { value: string; label: string; }[] = [];

	public ngOnInit(): void {
		this.initItems();
		this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
			this.initItems();
		});
	}

	public initItems(): void {
		this.items = [
			{
				value: PaymentRequirementEnum.NOT_REQUIRED,
				label: this.translateService.instant('client.profile.form.section.bookingSettings.select.paymentRequirement.options.NOT_REQUIRED'),
			},
			{
				value: PaymentRequirementEnum.REQUIRED_BEFORE_BOOKING,
				label: this.translateService.instant('client.profile.form.section.bookingSettings.select.paymentRequirement.options.REQUIRED_BEFORE_BOOKING'),
			}
		];
	}


}
