import {IPrice} from "@service/domain";

export interface IDurationVersion {
  breakInSeconds: number;
  durationInSeconds: number;
  prices: IPrice[];
}

export type RIDurationVersion = Required<IDurationVersion>;
export type ListDurationVersion = RIDurationVersion[];
