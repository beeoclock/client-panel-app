import {ActiveEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {RIBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {IContact} from "@client/domain/interface/i.contact";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {IAddress} from "@client/domain/interface/i.address";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";


export interface IClient extends RIBaseEntity {
	object: 'Client';
	active: ActiveEnum;
	name: string;
	logo: string;
	feature: string;
	businessCategory: BusinessCategoryEnum;
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
