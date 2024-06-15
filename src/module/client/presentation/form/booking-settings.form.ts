import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EarliestBookingEnum} from "@utility/domain/enum/earliest-booking.enum";
import {LatestBookingEnum} from "@utility/domain/enum/latest-booking.enum";
import {AutoActionOnEventInSecondsEnum} from "@utility/domain/enum/auto-action-on-event-in-seconds.enum";
import {AutomaticApprovalTimeType} from "@utility/domain/enum/automatic-approval-time.enum";
import {SlotSettingsForm} from "@client/presentation/form/slot-settings.form";

export interface IBookingSettingsForm {

	object: FormControl<'BookingSettings'>;
	autoActionOnOrderInSeconds: FormControl<AutoActionOnEventInSecondsEnum>;
	automaticApprovalType: FormControl<AutomaticApprovalTimeType>;
	latestBooking: FormControl<LatestBookingEnum>;
	earliestBooking: FormControl<EarliestBookingEnum>;
	slotSettings: SlotSettingsForm;
	autoBookOrder: FormControl<boolean>;
	mandatoryAttendeeProperties: FormControl<string[]>;
}

export class BookingSettingsForm extends FormGroup<IBookingSettingsForm> {

	constructor() {
		super({
			object: new FormControl('BookingSettings', {
				nonNullable: true,
			}),
			autoActionOnOrderInSeconds: new FormControl(AutoActionOnEventInSecondsEnum.ONE_HOUR, {
				nonNullable: true,
			}),
			automaticApprovalType: new FormControl(AutomaticApprovalTimeType.APPROVE, {
				nonNullable: true,
			}),
			latestBooking: new FormControl(LatestBookingEnum.TWO_WEEKS, {
				nonNullable: true,
			}),
			earliestBooking: new FormControl(EarliestBookingEnum.ONE_DAY, {
				nonNullable: true,
			}),
			autoBookOrder: new FormControl(true, {
				nonNullable: true,
			}),
			slotSettings: new SlotSettingsForm(),
			mandatoryAttendeeProperties: new FormControl([], {
				nonNullable: true,
			}),
		});

		this.initValidators();

	}

	private initValidators(): void {
		this.controls.autoActionOnOrderInSeconds.setValidators(Validators.required);
		this.controls.automaticApprovalType.setValidators(Validators.required);
		this.controls.latestBooking.setValidators(Validators.required);
		this.controls.earliestBooking.setValidators(Validators.required);
	}

}
