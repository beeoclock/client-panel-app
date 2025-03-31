import {AutoActionOnEventInSecondsEnum} from "@core/shared/enum/auto-action-on-event-in-seconds.enum";
import {LatestBookingEnum} from "@core/shared/enum/latest-booking.enum";
import {EarliestBookingEnum} from "@core/shared/enum/earliest-booking.enum";
import {ISlotSettings} from "@tenant/business-profile/domain/interface/i.slot-settings";

export interface IBookingSettings {
	object: 'BookingSettings';
	autoActionOnOrderInSeconds: AutoActionOnEventInSecondsEnum; // in seconds (Time after which the requested event will be canceled, if not approved)
	latestBooking: LatestBookingEnum; // in seconds (Minimum notice time)
	earliestBooking: EarliestBookingEnum; // in seconds (When an event can be booked)
	slotSettings: ISlotSettings;
	autoBookOrder?: boolean;
}
