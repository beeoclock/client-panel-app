import {WeekDaysEnum} from "@utility/domain/enum";

export interface ISchedule {
  workDays: WeekDaysEnum[];
  startTime: string;
  endTime: string;
  object: 'Schedule';
  createdAt: string;
  updatedAt: string;
  _id: string;
}
