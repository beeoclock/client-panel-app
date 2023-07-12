import {ActiveEnum} from "@utility/domain/enum";

export interface IClient {
  object: 'Client';
  _id: string;
  active: ActiveEnum;
  name: string;
}
