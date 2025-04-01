import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {ISocialNetworkLink} from "@tenant/business-profile/domain/interface/i.social-network-link";
import {IBaseDTO} from "@shared/domain/interface";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {IContact} from "@tenant/business-profile/domain/interface/i.contact";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {IAddress} from "@tenant/business-profile/domain/interface/i.address";
import {IBookingSettings} from "@tenant/business-profile/domain/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {BusinessClientStatusEnum} from "@tenant/business-profile/domain/enum/business-client-status.enum";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {DeepPartial} from "@shared/base.type";

export interface IBusinessSettings {
	timeZone?: string;
	baseCurrency?: CurrencyCodeEnum;
	currencies?: CurrencyCodeEnum[];
	availableLanguages: LanguageCodeEnum[];
	emailLanguage: LanguageCodeEnum;
	baseLanguage: LanguageCodeEnum;
	createdAt?: string;
	updatedAt?: string;
}

export interface INotificationsSettings {
	smsNotificationSettings: {
		allowedSmsTypes: {
			allowAll: true;
			specificTypes: []
		};
		sendNotificationConditionType: SendNotificationConditionEnum;
		activeProviderName: "twilio";
		providers: [];
	};
	emailNotificationSettings: {
		emailLanguage: LanguageCodeEnum;
		sendNotificationConditionType: SendNotificationConditionEnum;
		allowedEmailTypes?: boolean | string;
	};
	reminderSettings: {
		sendNotificationConditionType: "allow";
		reminders: [
			{
				reminderTimeInMinutes: number;
				actionType: "confirm";
				priority: "high";
			},
			{
				reminderTimeInMinutes: number;
				actionType: "confirm";
				priority: "high";
			}
		];
		escalationContact: "";
	};
	pushNotificationSettings: {
		allowedPushTypes: {
			allowAll: boolean;
			specificTypes: [];
		};
		sendNotificationConditionType: "allow";
	};
}

export interface RIClient extends IBaseDTO<'Client'> {
	status: BusinessClientStatusEnum;
	published: ActiveEnum;
	name: string;
	logo: RIMedia | null | undefined;
	feature: string;
	businessCategory: BusinessCategoryEnum;
	businessIndustry: BusinessIndustryEnum;
	serviceProfideType: ServiceProvideTypeEnum;
	socialNetworkLinks: ISocialNetworkLink[];

	businessSettings: IBusinessSettings;
	notificationSettings: INotificationsSettings;
	banners: RIMedia[];
	bookingSettings: IBookingSettings;
	addresses: IAddress[];
	schedules: RISchedule[];
	contacts: IContact[];
	// gallery: IGallery;
	gallery: RIMedia[];
	description: string;
	username?: string | null;
	facilities: FacilityEnum[];
}

export type IClient = DeepPartial<RIClient>;
