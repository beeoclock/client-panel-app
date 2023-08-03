import {IService} from "@service/domain";
import {ICustomer} from "@customer/domain";

export interface IEvent {
  _id?: string;
  servicesAreProvidedInParallel?: boolean;
  services?: IService[];
  description?: string;
  start?: string;
  end?: string;
  createdAt?: string;
  updatedAt?: string;
  timeZone?: string;


  /**
   * TODO
   * object: string;
   * email: string;
   * isOptional: IsOptionalEnum;
   * isOrganizer: IsOrganizerEnum;
   * responseStatus: ResponseStatusEnum;
   * customer: Customer;
   * active: ActiveEnum;
   */
  attendees?: ICustomer[];
}
