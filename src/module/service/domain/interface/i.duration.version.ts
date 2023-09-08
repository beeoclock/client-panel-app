import {IPrice} from "@service/domain";

export interface IDurationVersion {
  break: string;
  duration: string;
  prices: IPrice[];
}

export type RIDurationVersion = Required<IDurationVersion>;
export type ListDurationVersion = RIDurationVersion[];
