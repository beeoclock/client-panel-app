import {Enum, Interface} from "@utility/domain";

export interface ICustomer extends Interface.IBaseEntity {
  object?: 'Customer';
  active: Enum.ActiveEnum;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  note: string;
}
