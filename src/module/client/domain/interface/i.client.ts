import {ActiveEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {RIBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {IContact} from "@client/domain/interface/i.contact";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {IAddress} from "@client/domain/interface/i.address";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";
import {ServiceProvideTypeEnum} from "@utility/domain/enum/service-provide-type.enum";
import {BusinessIndustryEnum} from "@utility/domain/enum/business-industry.enum";
import {BusinessClientStatusEnum} from "@client/domain/enum/business-client-status.enum";

export interface RIClient extends RIBaseEntity {
	object: 'Client';
	status: BusinessClientStatusEnum;
	published: ActiveEnum;
	name: string;
	logo: string;
	feature: string;
	businessCategory: BusinessCategoryEnum;
	businessIndustry: BusinessIndustryEnum;
	serviceProfideType: ServiceProvideTypeEnum;
	socialNetworkLinks: ISocialNetworkLink[];

	banners: string[];
	bookingSettings: IBookingSettings;
	addresses: IAddress[];
	schedules: ISchedule[];
	contacts: IContact[];
	// gallery: IGallery;
	gallery: string[];
	description: string;
	facilities: FacilityEnum[];
}

export type IClient = Partial<RIClient>;
