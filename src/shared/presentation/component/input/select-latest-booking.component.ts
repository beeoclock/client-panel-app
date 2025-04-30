import {ChangeDetectionStrategy, Component, inject, input, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {LatestBookingEnum} from "@core/shared/enum/latest-booking.enum";
import {DefaultLabelDirective} from "@shared/presentation/directives/label/default.label.directive";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
	selector: 'select-latest-booking-component',
	standalone: true,
	template: `
		<div class="relative">
			<label default
				   [for]="id()">{{ 'keyword.capitalize.latestBooking' | translate }}</label>
			<ng-select bindLabel="name"
				bindValue="seconds"
				[items]="latestBookingList"
				[clearable]="false"
				[id]="id()"
				[formControl]="control()" />
		</div>
		<div class="italic leading-tight p-2 text-beeColor-500 text-sm">
			{{ 'client.profile.form.section.bookingSettings.input.latestBooking.placeholder' | translate }}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	imports: [
		ReactiveFormsModule,
		TranslateModule,
		DefaultLabelDirective,
		NgSelectModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectLatestBookingComponent {

	public readonly id = input('');

	public readonly control = input(new FormControl());

	public readonly translateService = inject(TranslateService);

	public readonly latestBookingList = Object.values(LatestBookingEnum)
		.filter((latestBookingName) => typeof latestBookingName === 'string')
		.map((latestBookingName) => {
			return {
				name: this.translateService.instant(`latestBooking.${latestBookingName}`),
				seconds: LatestBookingEnum[latestBookingName as keyof typeof LatestBookingEnum]
			};
		});

}
