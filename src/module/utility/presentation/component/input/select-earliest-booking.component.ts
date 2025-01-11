import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation, input} from "@angular/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {EarliestBookingEnum} from "@utility/domain/enum/earliest-booking.enum";
import {DefaultLabelDirective} from "@utility/presentation/directives/label/default.label.directive";

@Component({
	selector: 'select-earliest-booking-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default
				   [for]="id()">{{ 'keyword.capitalize.earliestBooking' | translate }}</label>
			<ng-select
				bindLabel="name"
				bindValue="seconds"
				[items]="earliestBookingList"
				[clearable]="false"
				[id]="id()"
				[formControl]="control()">
			</ng-select>
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.input.earliestBooking.placeholder' | translate }}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		NgSelectModule,
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectEarliestBookingComponent {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly translateService = inject(TranslateService);

	public readonly earliestBookingList = Object.values(EarliestBookingEnum)
		.filter((earliestBookingName) => typeof earliestBookingName === 'string')
		.map((earliestBookingName) => {
			return {
				name: this.translateService.instant(`earliestBooking.${earliestBookingName}`),
				seconds: EarliestBookingEnum[earliestBookingName as keyof typeof EarliestBookingEnum]
			};
		});

}
