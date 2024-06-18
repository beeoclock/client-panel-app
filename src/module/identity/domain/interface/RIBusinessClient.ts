import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {SlotBuildingStrategyEnum} from "@client/domain/enum/slot-building-strategy.enum";
import {SlotRetrievingStrategyEnum} from "@utility/domain/enum/slot-retrieving-strategy.enum";

export interface RIBusinessClient {

	name: string;
	serviceProvideType: ServiceProvideTypeEnum;
	businessCategory: BusinessCategoryEnum;
	businessIndustry: BusinessIndustryEnum;
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
