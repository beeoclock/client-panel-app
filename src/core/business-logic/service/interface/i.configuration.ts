import {IDurationConfiguration} from "./i.duration-configuration";

export interface IConfiguration {
  duration?: IDurationConfiguration;
}

export type RIConfiguration = Required<IConfiguration>;
