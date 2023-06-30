import {ActiveEnum} from "@utility/domain/enum";

export interface ICustomer {
  _id: string;
  active: ActiveEnum;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}
