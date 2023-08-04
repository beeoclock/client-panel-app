import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsNewCustomerEnum, IsOptionalEnum, IsOrganizerEnum, ResponseStatusEnum} from "@utility/domain/enum";
import {Interface} from "@utility/domain";

export interface IAttendee extends Interface.IBaseEntity {
  object?: 'Event.Attendant';
  isOptional: IsOptionalEnum;
  isOrganizer: IsOrganizerEnum;
  responseStatus: ResponseStatusEnum;
  isNewCustomer: IsNewCustomerEnum;
  customer: ICustomer;
  active: ActiveEnum;
}

export interface IEvent extends Interface.IBaseEntity {
  object: 'Event';
  servicesAreProvidedInParallel?: boolean;
  services?: IService[];
  description?: string;
  start?: string;
  end?: string;
  timeZone?: string;

  attendees?: IAttendee[];
}
