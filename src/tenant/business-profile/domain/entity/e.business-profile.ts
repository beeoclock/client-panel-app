import {ABaseEntity} from "@core/system/abstract/a.base-entity";
import {IBusinessProfile} from "@tenant/business-profile/domain/interface/i.business-profile";
import {IMedia} from "@tenant/media/domain/interface/i.media";
import {ActiveEnum} from "@core/shared/enum";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {ISchedule} from "@shared/domain/interface/i.schedule";
import {BusinessClientStatusEnum} from "../enum/business-client-status.enum";
import {IBusinessSettings, INotificationsSettings} from "../interface";
import {IAddress} from "../interface/i.address";
import {IBookingSettings} from "../interface/i.booking-settings";
import {IContact} from "../interface/i.contact";
import {ISocialNetworkLink} from "../interface/i.social-network-link";


export class EBusinessProfile extends ABaseEntity<'BusinessProfileDto', IBusinessProfile.DTO, IBusinessProfile.EntityRaw> implements IBusinessProfile.EntityRaw {

	override object = 'BusinessProfileDto' as const;

	publicPageSettings!: { primaryColor: string; };
	paymentSettings!: { externalApiCredentials: { stripe: { secretKey: string; webhookSecret: string; }; }; };
	specialSchedules = [];

	status!: BusinessClientStatusEnum;
	published!: ActiveEnum;
	name!: string;
	logo!: Required<IMedia> | null | undefined;
	feature!: string;
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
	username!: string | null;
	facilities!: FacilityEnum[];

	public override initBeforeConstructor() {
		this.username = null;
	}

	public override toDTO(): IBusinessProfile.DTO {
		return EBusinessProfile.toDTO(this);
	}

	public static toDTO(data: IBusinessProfile.EntityRaw): IBusinessProfile.DTO {
		return {
			notificationSettings: data.notificationSettings,
			socialNetworkLinks: data.socialNetworkLinks,
			publicPageSettings: data.publicPageSettings,
			specialSchedules: data.specialSchedules,
			businessSettings: data.businessSettings,
			bookingSettings: data.bookingSettings,
			paymentSettings: data.paymentSettings,
			description: data.description,
			facilities: data.facilities,
			addresses: data.addresses,
			published: data.published,
			schedules: data.schedules,
			contacts: data.contacts,
			username: data.username,
			banners: data.banners,
			feature: data.feature,
			gallery: data.gallery,
			status: data.status,
			logo: data.logo,
			name: data.name,

			_id: data._id,
			state: data.state,
			object: data.object,
			_version: data._version,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			stateHistory: data.stateHistory,

		}
	}

	/**
	 * Use it to create new entity, e.g. from API or form
	 * @param data
	 */
	public static fromDTO(data: IBusinessProfile.DTO): EBusinessProfile {
		return new EBusinessProfile(data);
	}

	/**
	 * Use it to create entity from raw data, e.g. from database
	 * @param data
	 */
	public static fromRaw(data: IBusinessProfile.EntityRaw): EBusinessProfile {
		return new EBusinessProfile(data);
	}

}

export default EBusinessProfile;
