import {ActiveEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {IBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {IGallery} from "@client/domain/interface/i.gallery";
import {IContact} from "@client/domain/interface/i.contact";
import {RISchedule} from "@utility/domain/interface/RISchedule";
import {IAddress} from "@client/domain/interface/i.address";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";
import {BusinessCategoryEnum} from "@utility/domain/enum/business-category.enum";


export interface IClient extends IBaseEntity {
  object: 'Client';
  active: ActiveEnum;
  name: string;
  logo: string;
  feature: string;
  businessCategory: BusinessCategoryEnum;
  socialNetworkLinks: ISocialNetworkLink[];

  banner: string;
  bookingSettings: IBookingSettings;
  addresses: IAddress[];
  schedules: RISchedule[];
  contacts: IContact[];
  gallery: IGallery;
  description: string;
  facilities: FacilityEnum[];
}
