import {Component, input, ViewEncapsulation} from "@angular/core";
import {BookingSettingsForm} from "@tenant/client/presentation/form/booking-settings.form";
import {CardComponent} from "@shared/presentation/component/card/card.component";
import {TranslateModule} from "@ngx-translate/core";
import {SelectEarliestBookingComponent} from "@shared/presentation/component/input/select-earliest-booking.component";
import {SelectLatestBookingComponent} from "@shared/presentation/component/input/select-latest-booking.component";
import {
	SelectSlotBuildingStrategyComponent
} from "@shared/presentation/component/input/select-slot-building-strategy.component";
import {
	MandatoryAttendeePropertiesComponent
} from "@tenant/client/presentation/ui/component/booking-settings/mandatory-attendee-properties/mandatory-attendee-properties.component";
import {
	PaymentRequirementComponent
} from "@tenant/client/presentation/ui/component/booking-settings/payment-requirment/payment-requirement.component";

@Component({
  selector: 'client-business-profile-booking-settings-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
	imports: [
		CardComponent,
		TranslateModule,
		SelectEarliestBookingComponent,
		SelectLatestBookingComponent,
		SelectSlotBuildingStrategyComponent,
		MandatoryAttendeePropertiesComponent,
		PaymentRequirementComponent
	],
  template: `
	  <bee-card gap="gap-8">

		  <strong class="dark:text-white">
			  {{ 'keyword.capitalize.services' | translate }}
		  </strong>

		  <select-latest-booking-component
			  [control]="form().controls.latestBooking"/>

		  <select-earliest-booking-component
			  [control]="form().controls.earliestBooking"/>

		  <hr>

		  <select-slot-building-strategy-component [slotSettings]="form().controls.slotSettings"/>

		  <!--	В низу знаходяться налаштування які відповідаю за крок "ЗАПИТ" коли бізнес має ще підтвердити чи приймає заявку на реалізацію		-->

		  <!--			<hr>-->

		  <!--      <select-auto-action-on-event-in-seconds-component-->
		  <!--        [control]="form.controls.autoActionOnOrderInSeconds"/>-->

		  <!--			<select-auto-action-type-on-event-component-->
		  <!--				[control]="form.controls.automaticApprovalType"/>-->

		  <!--			<div class="">-->
		  <!--				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.start' | translate }}-->
		  <!--				<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ 'autoActionTypeOnOrder.' + form.controls.automaticApprovalType.value | translate }}</kbd>-->
		  <!--				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.after' | translate }}-->
		  <!--				<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{{ form.controls.autoActionOnOrderInSeconds.value | humanizeDuration }}</kbd>-->
		  <!--				{{ 'client.profile.form.section.bookingSettings.hint.autoActionOnEvent.finish' | translate }}-->
		  <!--			</div>-->

		  <!--			<hr>-->

		  <!--			<select-slot-retrieving-strategy-component [slotSettings]="form.controls.slotSettings"/>-->


		  <client-booking-settings-mandatory-attendee-properties-component
			  [control]="form().controls.mandatoryAttendeeProperties"/>

		  <client-booking-settings-payment-requirement-component
			  [control]="form().controls.paymentRequirement"/>

	  </bee-card>
  `
})
export class BookingSettingsBusinessProfileComponent {

  public readonly form = input<BookingSettingsForm>(new BookingSettingsForm());

}
