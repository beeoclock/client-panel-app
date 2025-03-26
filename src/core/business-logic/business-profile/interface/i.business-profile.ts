import {IBaseDTO, IBaseEntityRaw} from "@utility/domain";
import {BusinessClientStatusEnum} from "@core/business-logic/business-profile/enum/business-client-status.enum";
import {ActiveEnum} from "@core/shared/enum";
import {RIMedia} from "@[tenant]/media/domain/interface/i.media";
import {BusinessCategoryEnum} from "@core/shared/enum/business-category.enum";
import {BusinessIndustryEnum} from "@core/shared/enum/business-industry.enum";
import {ServiceProvideTypeEnum} from "@core/shared/enum/service-provide-type.enum";
import {ISocialNetworkLink} from "@core/business-logic/business-profile/interface/i.social-network-link";
import {IBookingSettings} from "@core/business-logic/business-profile/interface/i.booking-settings";
import {IAddress} from "@core/business-logic/business-profile/interface/i.address";
import {RISchedule} from "@utility/domain/interface/i.schedule";
import {IContact} from "@core/business-logic/business-profile/interface/i.contact";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {Tools} from "@core/shared/tools";
import {IBusinessSettings, INotificationsSettings} from "@core/business-logic/business-profile";

export namespace IBusinessProfile {

	export interface DTO extends IBaseDTO<'BusinessProfileDto'> {
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
		username: string | null;
		facilities: FacilityEnum[];

		serviceProvideType: ServiceProvideTypeEnum | null;

		publicPageSettings: {
			primaryColor: string;
		},

		paymentSettings: {
			externalApiCredentials: {
				stripe: {
					secretKey: string;
					webhookSecret: string;
				}
			}
		},

		specialSchedules: {
			dates: string[];
			startInSeconds: number;
			endInSeconds: number;
			isClosed: boolean;
		}[];
		_version: string; // "1"
	}

	export type EntityRaw = IBaseEntityRaw<'BusinessProfileDto'> & DTO;

}

export const isBusinessProfile = Tools.createIs<IBusinessProfile.DTO>();
export const validBusinessProfile = Tools.createValidate<IBusinessProfile.DTO>();
export const randomBusinessProfile = Tools.createRandom<IBusinessProfile.DTO>();
