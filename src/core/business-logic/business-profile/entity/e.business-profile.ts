import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IBusinessProfile} from "@core/business-logic/business-profile/interface/i.business-profile";
import {IMedia} from "@module/media/domain/interface/i.media";
import {ActiveEnum} from "@core/shared/enum";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {BusinessClientStatusEnum} from "../enum/business-client-status.enum";
import {IBusinessSettings, INotificationsSettings} from "../interface";
import {IAddress} from "../interface/i.address";
import {IBookingSettings} from "../interface/i.booking-settings";
import {IContact} from "../interface/i.contact";
import {ISocialNetworkLink} from "../interface/i.social-network-link";


export class EBusinessProfile extends ABaseEntity<'BusinessProfileDto', IBusinessProfile.DTO> implements IBusinessProfile.Entity {
	status!: BusinessClientStatusEnum;
	published!: ActiveEnum;
	name!: string;
	logo!: Required<IMedia> | null | undefined;
	feature!: string;
	businessCategory!: BusinessCategoryEnum;
	businessIndustry!: BusinessIndustryEnum;
	serviceProfideType!: ServiceProvideTypeEnum;
	socialNetworkLinks!: ISocialNetworkLink[];
	businessSettings!: IBusinessSettings;
	notificationSettings!: INotificationsSettings;
	banners!: Required<IMedia>[];
	bookingSettings!: IBookingSettings;
	addresses!: IAddress[];
	schedules!: Required<ISchedule>[];
	contacts!: IContact[];
	gallery!: Required<IMedia>[];
	description!: string;
	username?: string | null | undefined;
	facilities!: FacilityEnum[];


	public override toDTO(): IBusinessProfile.DTO {
		return EBusinessProfile.toDTO(this);
	}

	public static toDTO(data: IBusinessProfile.Entity): IBusinessProfile.DTO {
		return {
			_id: data._id,
			addresses: data.addresses,
			banners: data.banners,
			bookingSettings: data.bookingSettings,
			businessCategory: data.businessCategory,
			businessIndustry: data.businessIndustry,
			businessSettings: data.businessSettings,
			contacts: data.contacts,
			createdAt: data.createdAt,
			description: data.description,
			facilities: data.facilities,
			feature: data.feature,
			gallery: data.gallery,
			logo: data.logo,
			name: data.name,
			notificationSettings: data.notificationSettings,
			object: data.object,
			published: data.published,
			schedules: data.schedules,
			serviceProfideType: data.serviceProfideType,
			socialNetworkLinks: data.socialNetworkLinks,
			state: data.state,
			stateHistory: data.stateHistory,
			status: data.status,
			updatedAt: data.updatedAt,
		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static create(data: IBusinessProfile.DTO): IBusinessProfile.Entity {
		return new EBusinessProfile(data);
	}

}

export default EBusinessProfile;
