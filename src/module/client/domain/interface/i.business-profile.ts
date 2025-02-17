import {IBaseEntity} from "@utility/domain";
import {BusinessClientStatusEnum} from "@client/domain/enum/business-client-status.enum";
import {ActiveEnum} from "@core/shared/enum";
import {RIMedia} from "@module/media/domain/interface/i.media";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";
import {IAddress} from "@client/domain/interface/i.address";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IContact} from "@client/domain/interface/i.contact";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import IBaseItem from "@core/shared/interface/i.base-item";
import {Tools} from "@src/core/shared/tools";
import {IBusinessSettings, INotificationsSettings} from "@client/domain";

export namespace IBusinessProfile {

	export interface DTO extends IBaseEntity<'BusinessProfileDto'> {
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

	export interface Entity extends IBaseItem<'BusinessProfileDto', DTO>, DTO {

		// TODO: add key in base entity to know if entity synced and when it was synced

		// TODO: getOrders
		// TODO: getFavoriteSpecialist
		// TODO: getFavoriteCustomer

	}

}

export const isBusinessProfile = Tools.createIs<IBusinessProfile.DTO>();
export const validBusinessProfile = Tools.createValidate<IBusinessProfile.DTO>();
export const randomBusinessProfile = Tools.createRandom<IBusinessProfile.DTO>();
