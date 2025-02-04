import {IPrice, RIPrice} from "@service/domain";

export interface IDurationVersion {
  breakInSeconds: number;
  durationInSeconds: number;
  prices: IPrice[];
}

export type RIDurationVersion = Required<IDurationVersion> & {
	prices: RIPrice[];
};
export type ListDurationVersion = RIDurationVersion[];
