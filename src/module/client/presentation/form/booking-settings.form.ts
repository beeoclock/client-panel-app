import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EarliestBookingEnum} from "@utility/domain/enum/earliest-booking.enum";
import {LatestBookingEnum} from "@utility/domain/enum/latest-booking.enum";
import {AutoActionOnEventInSecondsEnum} from "@utility/domain/enum/auto-action-on-event-in-seconds.enum";
import {AutomaticApprovalTimeType} from "@utility/domain/enum/automatic-approval-time.enum";
import {SlotSettingsForm} from "@client/presentation/form/slot-settings.form";

export interface IBookingSettingsForm {

	object: FormControl<'BookingSettings'>;
	autoActionOnEventInSeconds: FormControl<AutoActionOnEventInSecondsEnum>;
	automaticApprovalType: FormControl<AutomaticApprovalTimeType>;
	latestBooking: FormControl<LatestBookingEnum>;
	earliestBooking: FormControl<EarliestBookingEnum>;
	slotSettings: SlotSettingsForm;
	autoBookEvent: FormControl<boolean>;
	mandatoryAttendeeProperties: FormControl<string[]>;
}

export class BookingSettingsForm extends FormGroup<IBookingSettingsForm> {

	constructor() {
		super({
			object: new FormControl('BookingSettings', {
				nonNullable: true,
			}),
			autoActionOnEventInSeconds: new FormControl(),
			automaticApprovalType: new FormControl(),
			latestBooking: new FormControl(),
			earliestBooking: new FormControl(),
			autoBookEvent: new FormControl(false, {
				nonNullable: true,
			}),
			slotSettings: new SlotSettingsForm(),
			mandatoryAttendeeProperties: new FormControl([], {
				nonNullable: true,
			}),
		});

		this.initValue();
		this.initValidators();

	}

	private initValue(): void {
		this.controls.earliestBooking.setValue(EarliestBookingEnum.ONE_DAY);
		this.controls.latestBooking.setValue(LatestBookingEnum.TWO_WEEKS);
		this.controls.autoActionOnEventInSeconds.setValue(AutoActionOnEventInSecondsEnum.ONE_HOUR);
		this.controls.automaticApprovalType.setValue(AutomaticApprovalTimeType.APPROVE);
	}

	private initValidators(): void {
		this.controls.autoActionOnEventInSeconds.setValidators(Validators.required);
		this.controls.automaticApprovalType.setValidators(Validators.required);
		this.controls.latestBooking.setValidators(Validators.required);
		this.controls.earliestBooking.setValidators(Validators.required);
	}

}
