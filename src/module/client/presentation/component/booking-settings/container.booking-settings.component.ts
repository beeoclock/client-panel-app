import {Component, Input, ViewEncapsulation} from "@angular/core";
import {BookingSettingsForm} from "@client/presentation/form";
import {
	MandatoryAttendeePropertiesComponent
} from "@client/presentation/component/booking-settings/mandatory-attendee-properties.component";
import {CardComponent} from "@utility/presentation/component/card/card.component";

@Component({
	selector: 'client-booking-settings-container-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [
		MandatoryAttendeePropertiesComponent,
		CardComponent
	],
	template: `
		<bee-card>
			<client-booking-settings-mandatory-attendee-properties-component
				[control]="bookingSettings.controls.mandatoryAttendeeProperties"/>
		</bee-card>
	`
})
export class ContainerBookingSettingsComponent {

	@Input({ required: true })
	public bookingSettings!: BookingSettingsForm;

}
