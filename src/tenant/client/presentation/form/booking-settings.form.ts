import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EarliestBookingEnum} from "@core/shared/enum/earliest-booking.enum";
import {LatestBookingEnum} from "@core/shared/enum/latest-booking.enum";
import {AutoActionOnEventInSecondsEnum} from "@core/shared/enum/auto-action-on-event-in-seconds.enum";
import {AutomaticApprovalTimeType} from "@core/shared/enum/automatic-approval-time.enum";
import {SlotSettingsForm} from "@tenant/client/presentation/form/slot-settings.form";
import {PaymentRequirementEnum} from "@identity/identity/domain/enum/payment-requirement.enum";

const MINUTES_25_IN_SECONDS = 25 * 60; // 25 minutes in seconds

export interface IBookingSettingsForm {

	object: FormControl<'BookingSettings'>;
	autoActionOnOrderInSeconds: FormControl<AutoActionOnEventInSecondsEnum>;
	automaticApprovalType: FormControl<AutomaticApprovalTimeType>;
	latestBooking: FormControl<LatestBookingEnum>;
	earliestBooking: FormControl<EarliestBookingEnum>;
	slotSettings: SlotSettingsForm;
	autoBookOrder: FormControl<boolean>;
	mandatoryAttendeeProperties: FormControl<string[]>;
	paymentRequirement: FormControl<PaymentRequirementEnum>;
	paymentDeadlineInSeconds: FormControl<number>;
}

export class BookingSettingsForm extends FormGroup<IBookingSettingsForm> {

	public constructor() {
		super({
			object: new FormControl<'BookingSettings'>('BookingSettings', {
				nonNullable: true,
			}),
			autoActionOnOrderInSeconds: new FormControl<AutoActionOnEventInSecondsEnum>(AutoActionOnEventInSecondsEnum.ONE_HOUR, {
				nonNullable: true,
			}),
			automaticApprovalType: new FormControl<AutomaticApprovalTimeType>(AutomaticApprovalTimeType.APPROVE, {
				nonNullable: true,
			}),
			latestBooking: new FormControl<LatestBookingEnum>(LatestBookingEnum.TWO_WEEKS, {
				nonNullable: true,
			}),
			earliestBooking: new FormControl<EarliestBookingEnum>(EarliestBookingEnum.ONE_DAY, {
				nonNullable: true,
			}),
			autoBookOrder: new FormControl<boolean>(true, {
				nonNullable: true,
			}),
			slotSettings: new SlotSettingsForm(),
			mandatoryAttendeeProperties: new FormControl<string[]>([], {
				nonNullable: true,
			}),
			paymentRequirement: new FormControl<PaymentRequirementEnum>(PaymentRequirementEnum.NOT_REQUIRED, {
				nonNullable: true,
			}),
			paymentDeadlineInSeconds: new FormControl<number>(MINUTES_25_IN_SECONDS, {
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
