import {SocialNetworkEnum} from "@core/shared/enum/social-network.enum";

export interface ISocialNetworkLink {
  object: 'SocialNetworkLink';
  link: string;
  type: SocialNetworkEnum;
}
