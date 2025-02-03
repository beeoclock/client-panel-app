import {SocialNetworkEnum} from "@utility/domain/enum/social-network.enum";

export interface ISocialNetworkLink {
  object: 'SocialNetworkLink';
  link: string;
  type: SocialNetworkEnum;
}
