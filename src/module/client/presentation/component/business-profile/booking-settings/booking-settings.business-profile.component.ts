import {Component, Input, ViewEncapsulation} from "@angular/core";
import {BookingSettingsForm} from "@client/presentation/form/booking-settings.form";
import {CardComponent} from "@utility/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SelectEarliestBookingComponent} from "@utility/presentation/component/input/select-earliest-booking.component";
import {SelectLatestBookingComponent} from "@utility/presentation/component/input/select-latest-booking.component";
import {SelectApprovalTimeComponent} from "@utility/presentation/component/input/select-approval-time.component";

@Component({
  selector: 'client-business-profile-booking-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    TranslateModule,
    SelectEarliestBookingComponent,
    SelectLatestBookingComponent,
    SelectApprovalTimeComponent
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

      <select-approval-time-component
        [control]="form.controls.approvalTimeInSeconds"/>

    </bee-card>
  `
})
export class BookingSettingsBusinessProfileComponent {

  @Input()
  public form = new BookingSettingsForm();

}
