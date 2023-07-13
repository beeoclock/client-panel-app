import {ActiveEnum} from "@utility/domain/enum";
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";

export interface IClient {
  object: 'Client';
  _id: string;
  active: ActiveEnum;
  name: string;
  logo: string;
  address: string;
  startingPrice: string;
  slogan: string;
  socialNetworkLinks: ISocialNetworkLink[];
}
