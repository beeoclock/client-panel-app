import {Interface} from "@utility/domain";

export interface IMember extends Interface.IBaseEntity {
  object: 'Member';
  firstName: string;
  secondName: string;
  lastName: string;
  email: string;
  phone: string;
}
