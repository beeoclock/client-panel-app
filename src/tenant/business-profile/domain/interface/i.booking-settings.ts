import {LatestBookingEnum} from "@core/shared/enum/latest-booking.enum";
import {EarliestBookingEnum} from "@core/shared/enum/earliest-booking.enum";
import {ISlotSettings} from "@tenant/business-profile/domain/interface/i.slot-settings";
import { AutomaticApprovalTimeType } from "@core/shared/enum/automatic-approval-time.enum";

export interface IBookingSettings {
	object: 'BookingSettings';
	latestBooking: LatestBookingEnum; // in seconds (Minimum notice time)
	earliestBooking: EarliestBookingEnum; // in seconds (When an event can be booked)
	slotSettings: ISlotSettings;

	autoBookOrder: boolean;
	autoActionSettings: {
		isEnabled: boolean;
		actionType: AutomaticApprovalTimeType;
		delayInSeconds: number;
	};
}
