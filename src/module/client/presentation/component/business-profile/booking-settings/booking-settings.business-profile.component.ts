import {Component, Input, ViewEncapsulation} from "@angular/core";
import {BookingSettingsForm} from "@client/presentation/form/booking-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SelectEarliestBookingComponent} from "@utility/presentation/component/input/select-earliest-booking.component";
import {SelectLatestBookingComponent} from "@utility/presentation/component/input/select-latest-booking.component";
import {
	SelectAutoActionOnEventInSecondsComponent
} from "@utility/presentation/component/input/select-auto-action-on-event-in-seconds.component";
import {
	SelectAutoActionTypeOnEventComponent
} from "@utility/presentation/component/input/select-auto-action-type-on-event.component";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

@Component({
  selector: 'client-business-profile-booking-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		SelectEarliestBookingComponent,
		SelectLatestBookingComponent,
		SelectAutoActionOnEventInSecondsComponent,
		SelectAutoActionTypeOnEventComponent,
		HumanizeDurationPipe
	],
  template: `
    <bee-card gap="gap-8">

      <strong class="dark:text-white">
        {{ 'keyword.capitalize.bookingSettings' | translate }}
      </strong>

      <select-latest-booking-component
        [control]="form.controls.latestBooking"/>

      <select-earliest-booking-component
        [control]="form.controls.earliestBooking"/>

			<hr>

      <select-auto-action-on-event-in-seconds-component
        [control]="form.controls.autoActionOnEventInSeconds"/>

			<select-auto-action-type-on-event-component
				[control]="form.controls.automaticApprovalType"/>

			<div class="flex items-center gap-2">
				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.start' | translate }}
				<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
					{{ 'autoActionTypeOnEvent.' + form.controls.automaticApprovalType.value | translate }}
				</kbd>
				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.after' | translate }}
				<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
					{{ form.controls.autoActionOnEventInSeconds.value | humanizeDuration }}
				</kbd>
				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.finish' | translate }}
			</div>

    </bee-card>
  `
})
export class BookingSettingsBusinessProfileComponent {

  @Input()
  public form = new BookingSettingsForm();

}
