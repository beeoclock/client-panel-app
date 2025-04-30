import {IBaseDTO, IBaseEntityRaw} from "@shared/domain";
import {BusinessClientStatusEnum} from "@tenant/business-profile/domain/enum/business-client-status.enum";
import {ActiveEnum} from "@core/shared/enum";
import {RIMedia} from "@tenant/media/domain/interface/i.media";
import {ISocialNetworkLink} from "@tenant/business-profile/domain/interface/i.social-network-link";
import {IBookingSettings} from "@tenant/business-profile/domain/interface/i.booking-settings";
import {IAddress} from "@tenant/business-profile/domain/interface/i.address";
import {RISchedule} from "@shared/domain/interface/i.schedule";
import {IContact} from "@tenant/business-profile/domain/interface/i.contact";
import {FacilityEnum} from "@core/shared/enum/facility.enum";
import {Tools} from "@core/shared/tools";
import {IBusinessSettings, INotificationsSettings} from "@tenant/business-profile/domain";

export namespace IBusinessProfile {

	export interface DTO extends IBaseDTO<'BusinessProfileDto'> {
		status: BusinessClientStatusEnum;
		published: ActiveEnum;
		name: string;
		logo: RIMedia | null | undefined;
		feature: string;
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
