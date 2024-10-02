import {ActiveEnum, CurrencyCodeEnum, LanguageCodeEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {IBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {IContact} from "@client/domain/interface/i.contact";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IAddress} from "@client/domain/interface/i.address";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {BusinessClientStatusEnum} from "@client/domain/enum/business-client-status.enum";
import {RIMedia} from "@module/media/domain/interface/i.media";
import {DeepPartial} from "@utility/base.type";
import {SendNotificationConditionEnum} from "@utility/domain/enum/send-notification-condition.enum";

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
