import {ABaseItem} from "../../../../../core/system/abstract/a.base-item";
import {IBusinessProfile} from "@client/domain/interface/i.business-profile";
import {IMedia} from "@src/module/media/domain/interface/i.media";
import {ActiveEnum} from "@src/module/utility/domain/enum";
import {BusinessCategoryEnum} from "@src/module/utility/domain/enum/business-category.enum";
import {BusinessIndustryEnum} from "@src/module/utility/domain/enum/business-industry.enum";
import {FacilityEnum} from "@src/module/utility/domain/enum/facility.enum";
import {ServiceProvideTypeEnum} from "@src/module/utility/domain/enum/service-provide-type.enum";
import {ISchedule} from "@src/module/utility/domain/interface/i.schedule";
import {BusinessClientStatusEnum} from "../enum/business-client-status.enum";
import {IBusinessSettings, INotificationsSettings} from "../interface";
import {IAddress} from "../interface/i.address";
import {IBookingSettings} from "../interface/i.booking-settings";
import {IContact} from "../interface/i.contact";
import {ISocialNetworkLink} from "../interface/i.social-network-link";


export class EBusinessProfile extends ABaseItem<'BusinessProfileDto', IBusinessProfile.DTO> implements IBusinessProfile.Entity {
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
		const {id, ...rest} = data;
		return rest;
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
