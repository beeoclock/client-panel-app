import {ActiveEnum} from '@utility/domain/enum/active.enum';
import {ISocialNetworkLink} from "@client/domain/interface/i.social-network-link";

export interface ISettings { // DONT USE!!!
  _id: string;
  id: 'settings';

  name: string;
  description: string;
  active: ActiveEnum;
  socialNetworkLinks: ISocialNetworkLink[];
}
