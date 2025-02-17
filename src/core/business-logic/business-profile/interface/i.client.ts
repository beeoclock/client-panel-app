import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@core/shared/enum";
import {ISocialNetworkLink} from "@core/business-logic/business-profile/interface/i.social-network-link";
import {IBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {IContact} from "@core/business-logic/business-profile/interface/i.contact";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IAddress} from "@core/business-logic/business-profile/interface/i.address";
import {IBookingSettings} from "@core/business-logic/business-profile/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {BusinessClientStatusEnum} from "@core/business-logic/business-profile/enum/business-client-status.enum";
import {RIMedia} from "@module/media/domain/interface/i.media";
import {SendNotificationConditionEnum} from "@core/shared/enum/send-notification-condition.enum";
import {DeepPartial} from "@utility/base.type";

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
		sendNotificationConditionType: SendNotificationConditionEnum;
	};
	emailNotificationSettings: {
		emailLanguage: LanguageCodeEnum;
		sendNotificationConditionType: SendNotificationConditionEnum;
		allowedEmailTypes?: boolean | string;
	};
}

export interface RIClient extends IBaseEntity<'Client'> {
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


