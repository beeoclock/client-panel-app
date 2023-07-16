import {ActiveEnum} from "@utility/domain/enum";

export interface IBusinessClient {

  _id: string;
  logo: string;
  slogan: string;
  address: string;
  name: string;
  startingPrice: string;
  active: ActiveEnum;

}
