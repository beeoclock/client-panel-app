import {SlotBuildingStrategyEnum} from "@tenant/business-profile/domain/enum/slot-building-strategy.enum";
import {SlotRetrievingStrategyEnum} from "@core/shared/enum/slot-retrieving-strategy.enum";

export interface RIBusinessClient {

	name: string;
	businessOwner?: {
		firstName?: string;
		lastName?: string;
	};
	bookingSettings?: {
		// object: "BookingSettingsClientDto" | undefined;
		// object: any;
		// autoActionSettings: {
		// 	object: "AutoActionBookingSettingsDto";
		// 	delayInSeconds: number;
		// 	isEnabled: boolean;
		// 	actionType: "APPROVE";
		// };
		latestBooking: number;
		earliestBooking: number;
		slotSettings: {
			// object: "SlotSettingsDto";
			slotIntervalInSeconds: number;
			slotBuildingStrategy: SlotBuildingStrategyEnum;
			slotRetrievingStrategy: SlotRetrievingStrategyEnum;
		};
		autoBookOrder: boolean;
		mandatoryAttendeeProperties: string[];
		// paymentRequirement: string;
		// paymentDeadlineInSeconds: number;
	}

}

export type IBusinessClient = Partial<RIBusinessClient>;
