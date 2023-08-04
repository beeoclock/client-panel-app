import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";
import {ActiveEnum, IsOptionalEnum, IsOrganizerEnum, ResponseStatusEnum} from "@utility/domain/enum";

export interface IAttendee {
  object: 'Event.Attendant';
  email: string;
  isOptional: IsOptionalEnum;
  isOrganizer: IsOrganizerEnum;
  responseStatus: ResponseStatusEnum;
  customer: ICustomer;
  active: ActiveEnum;

  // Added by the system
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEvent {
  servicesAreProvidedInParallel?: boolean;
  services?: IService[];
  description?: string;
  start?: string;
  end?: string;
  timeZone?: string;

  attendees?: IAttendee[];

  // Added by the system
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
