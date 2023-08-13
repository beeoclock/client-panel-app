import {ActiveEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";
import {IBaseEntity} from "@utility/domain/interface";
import {FacilityEnum} from "@utility/domain/enum/facility.enum";
import {IGallery} from "@client/domain/interface/i.gallery";
import {IContact} from "@client/domain/interface/i.contact";
import {ISchedule} from "@utility/domain/interface/i.schedule";
import {IAddress} from "@client/domain/interface/i.address";
import {IBookingSettings} from "@client/domain/interface/i.booking-settings";


export interface IClient extends IBaseEntity {
  object: 'Client';
  active: ActiveEnum;
  name: string;
  logo: string;
  feature: string;
  slogan: string;
  socialNetworkLinks: ISocialNetworkLink[];

  banner: string;
  bookingSettings: IBookingSettings;
  addresses: IAddress[];
  schedules: ISchedule[];
  contacts: IContact[];
  gallery: IGallery;
  description: string;
  facilities: FacilityEnum[];
}
