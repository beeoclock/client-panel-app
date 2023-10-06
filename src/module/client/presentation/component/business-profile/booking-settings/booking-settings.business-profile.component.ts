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
		SelectAutoActionTypeOnEventComponent
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

      <select-auto-action-on-event-in-seconds-component
        [control]="form.controls.autoActionOnEventInSeconds"/>

			<select-auto-action-type-on-event-component
				[control]="form.controls.automaticApprovalType"/>

    </bee-card>
  `
})
export class BookingSettingsBusinessProfileComponent {

  @Input()
  public form = new BookingSettingsForm();

}
