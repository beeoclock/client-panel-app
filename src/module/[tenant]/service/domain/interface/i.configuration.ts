import {IDurationConfiguration} from "@service/domain/interface/i.duration-configuration";

export interface IConfiguration {
  duration?: IDurationConfiguration;
}

export type RIConfiguration = Required<IConfiguration>;
