import {IPrice, RIPrice} from "../index";

export interface IDurationVersion {
  breakInSeconds: number;
  durationInSeconds: number;
  prices: IPrice[];
}

export type RIDurationVersion = Required<IDurationVersion> & {
	prices: RIPrice[];
};
export type ListDurationVersion = RIDurationVersion[];
