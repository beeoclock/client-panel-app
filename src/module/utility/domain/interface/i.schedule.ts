import {WeekDaysEnum} from "src/core/shared/enum";

export interface ISchedule {
  workDays?: WeekDaysEnum[];
  startInSeconds?: number;
  endInSeconds?: number;
  object?: 'Schedule';
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export type RISchedule = Required<ISchedule>;
