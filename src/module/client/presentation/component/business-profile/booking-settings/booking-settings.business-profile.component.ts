import {Component, Input, ViewEncapsulation} from "@angular/core";
import {BookingSettingsForm} from "@client/form/booking-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SelectEarliestBookingComponent} from "@utility/presentation/component/input/select-earliest-booking.component";
import {SelectLatestBookingComponent} from "@utility/presentation/component/input/select-latest-booking.component";

@Component({
  selector: 'client-business-profile-booking-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    SelectEarliestBookingComponent,
    SelectLatestBookingComponent
  ],
  template: `
    <card>

      <strong class="dark:text-white">
        {{ 'keyword.capitalize.bookingSettings' | translate }}
      </strong>

      <select-earliest-booking-component
        [control]="form.controls.earliestBooking">
      </select-earliest-booking-component>

      <select-latest-booking-component
        [control]="form.controls.latestBooking">
      </select-latest-booking-component>

    </card>
  `
})
export class BookingSettingsBusinessProfileComponent {

  @Input()
  public form = new BookingSettingsForm();

}
