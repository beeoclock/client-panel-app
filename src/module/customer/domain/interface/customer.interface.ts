import {Enum, RIBaseEntity} from "@src/module/utility/domain";


export interface ICustomer extends RIBaseEntity {
  object?: 'Customer';
  active: Enum.ActiveEnum;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  note: string;
}
